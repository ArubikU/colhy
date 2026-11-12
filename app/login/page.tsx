
'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers';
import Link from 'next/link';

export default function LoginPage() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await signIn(email);
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
                    <h2 className="text-2xl font-bold mb-4 text-green-600">¡Enlace enviado!</h2>
                    <p className="text-slate-600 mb-6">Hemos enviado un enlace mágico a <strong>{email}</strong>.</p>
                    <p className="text-sm text-slate-500">Revisa tu bandeja de entrada (y spam) para iniciar sesión.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-center mb-6 text-slate-900">Bienvenido a Colhy</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {status === 'error' && (
                        <div className="text-red-500 text-sm text-center">
                            Ocurrió un error al enviar el enlace. Intenta nuevamente.
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
                    >
                        {status === 'loading' ? 'Enviando...' : 'Continuar con Email'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    ¿No tienes cuenta? <span className="text-blue-600">Se creará automáticamente.</span>
                </div>
            </div>
        </div>
    );
}
