
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers';
import Link from 'next/link';
import { QuoteForm } from '@/components/quote-form';
import { DashboardStats } from '@/components/dashboard-stats';
import { QuoteFilters } from '@/components/quote-filters';
import { QuotesTable } from '@/components/quotes-table';
import { AIModel } from '@/lib/ai';

interface Quote {
    id: string;
    description: string;
    status: 'draft' | 'pending' | 'sent' | 'accepted';
    hourlyRate: number;
    createdAt: string;
    minimumHours?: number;
    generatedQuote?: string;
}

interface DashboardClientProps {
    models: AIModel[];
}

export function DashboardClient({ models }: DashboardClientProps) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [quotes, setQuotes] = useState<Quote[]>([]);

    // Initialize showForm based on query param
    const [showForm, setShowForm] = useState(() => {
        return searchParams.get('new') === 'true';
    });

    // Sync state with URL params
    useEffect(() => {
        const isNew = searchParams.get('new') === 'true';
        setShowForm(isNew);
    }, [searchParams]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

    // Filter quotes based on search and filters
    const filteredQuotes = useMemo(() => {
        return quotes.filter((q) => {
            const matchesSearch =
                q.description.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === '';
            const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
            const matchesPrice = q.hourlyRate >= priceRange[0] && q.hourlyRate <= priceRange[1];
            return matchesSearch && matchesStatus && matchesPrice;
        });
    }, [quotes, searchTerm, statusFilter, priceRange]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchQuotes();
        }
    }, [user]);

    const fetchQuotes = async () => {
        if (!user) return;
        try {
            const res = await fetch('/api/quotes');
            if (res.ok) {
                const data = await res.json();
                setQuotes(data.quotes || []);
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
        }
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p>No autorizado. Redirigiendo...</p>
                <div className="text-xs text-slate-500">
                    Debug: Loading: {String(loading)}, User: {String(user)}
                </div>
                <button
                    onClick={() => router.push('/login')}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Ir al Login
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">ColhyAI</h1>
                        <p className="text-slate-600 text-sm">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {showForm ? 'Ver Historial' : 'Nueva Cotización'}
                        </button>
                        <Link
                            href="/settings"
                            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                            ⚙️ Configuración
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {showForm ? (
                    <QuoteForm models={models} />
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard de Cotizaciones</h2>

                            {/* Statistics */}
                            {quotes.length > 0 && <DashboardStats quotes={quotes} />}

                            {/* Filters */}
                            {quotes.length > 0 && (
                                <QuoteFilters
                                    quotes={quotes}
                                    searchTerm={searchTerm}
                                    onSearchChange={setSearchTerm}
                                    statusFilter={statusFilter}
                                    onStatusChange={setStatusFilter}
                                    priceRange={priceRange}
                                    onPriceChange={setPriceRange}
                                />
                            )}

                            {/* Quotes Table */}
                            <QuotesTable
                                quotes={quotes}
                                filteredQuotes={filteredQuotes}
                                onDelete={async (id) => {
                                    if (confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
                                        try {
                                            const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
                                            if (res.ok) {
                                                setQuotes(prev => prev.filter(q => q.id !== id));
                                            } else {
                                                alert('Error al eliminar la cotización');
                                            }
                                        } catch (e) {
                                            console.error(e);
                                            alert('Error al eliminar');
                                        }
                                    }
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
