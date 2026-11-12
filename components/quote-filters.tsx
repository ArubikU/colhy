'use client';

import { useMemo } from 'react';

interface Quote {
  id: string;
  description: string;
  status: 'draft' | 'pending' | 'sent' | 'accepted';
  hourlyRate: number;
  createdAt: string;
}

interface QuoteFiltersProps {
  quotes: Quote[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

export function QuoteFilters({
  quotes,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priceRange,
  onPriceChange,
}: QuoteFiltersProps) {
  const maxPrice = useMemo(() => {
    return Math.max(...quotes.map((q) => q.hourlyRate), 0);
  }, [quotes]);

  const filteredCount = useMemo(() => {
    return quotes.filter((q) => {
      const matchesSearch =
        q.description.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === '';
      const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
      const matchesPrice =
        q.hourlyRate >= priceRange[0] && q.hourlyRate <= priceRange[1];
      return matchesSearch && matchesStatus && matchesPrice;
    }).length;
  }, [quotes, searchTerm, statusFilter, priceRange]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Filtros y Búsqueda</h3>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Buscar</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Describe el proyecto..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="draft">Borradores</option>
            <option value="generated">Generadas</option>
            <option value="sent">Enviadas</option>
            <option value="accepted">Aceptadas</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Rango de Tarifa: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max={maxPrice || 500}
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
        </div>
      </div>

      <div className="text-sm text-slate-600 pt-2 border-t border-slate-200">
        Mostrando {filteredCount} de {quotes.length} cotizaciones
      </div>
    </div>
  );
}
