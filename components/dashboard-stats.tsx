'use client';

import { useMemo } from 'react';

interface Quote {
  id: string;
  description: string;
  status: 'draft' | 'pending' | 'sent' | 'accepted';
  hourlyRate: number;
  minimumHours?: number;
  createdAt: string;
  generatedQuote?: string;
}

interface DashboardStatsProps {
  quotes: Quote[];
}

export function DashboardStats({ quotes }: DashboardStatsProps) {
  const stats = useMemo(() => {
    const totalQuotes = quotes.length;
    const generatedQuotes = quotes.filter((q) => q.status === 'pending').length;
    const sentQuotes = quotes.filter((q) => q.status === 'sent').length;
    const acceptedQuotes = quotes.filter((q) => q.status === 'accepted').length;

    const totalPotentialValue = quotes.reduce((sum, q) => {
      const estimatedHours = q.minimumHours || 40; // Default estimate
      return sum + q.hourlyRate * estimatedHours;
    }, 0);

    const completionRate =
      totalQuotes > 0 ? ((generatedQuotes + sentQuotes + acceptedQuotes) / totalQuotes) * 100 : 0;

    return {
      totalQuotes,
      generatedQuotes,
      sentQuotes,
      acceptedQuotes,
      totalPotentialValue,
      completionRate,
    };
  }, [quotes]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <StatCard
        label="Total de Cotizaciones"
        value={stats.totalQuotes}
        color="bg-blue-50"
        icon="📋"
      />
      <StatCard
        label="Generadas"
        value={stats.generatedQuotes}
        color="bg-green-50"
        icon="✓"
      />
      <StatCard
        label="Enviadas"
        value={stats.sentQuotes}
        color="bg-purple-50"
        icon="📤"
      />
      <StatCard
        label="Aceptadas"
        value={stats.acceptedQuotes}
        color="bg-emerald-50"
        icon="🎉"
      />
      <StatCard
        label="Valor Potencial"
        value={`$${((stats.totalPotentialValue || 0) / 1000).toFixed(1)}k`}
        color="bg-yellow-50"
        icon="💰"
      />
      <StatCard
        label="Tasa Completación"
        value={`${stats.completionRate.toFixed(0)}%`}
        color="bg-indigo-50"
        icon="📊"
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  icon: string;
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  return (
    <div className={`${color} rounded-lg p-4 border border-slate-200`}>
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-sm text-slate-600 font-medium">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
