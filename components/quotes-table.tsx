'use client';

import Link from 'next/link';

interface Quote {
  id: string;
  description: string;
  status: 'draft' | 'pending' | 'sent' | 'accepted';
  hourlyRate: number;
  createdAt: string;
  minimumHours?: number;
  generatedQuote?: string;
}

interface QuotesTableProps {
  quotes: Quote[];
  filteredQuotes: Quote[];
  onDelete: (id: string) => void;
}

const statusConfig = {
  draft: { label: 'Borrador', color: 'bg-yellow-100 text-yellow-800' },
  pending: { label: 'Pendiente', color: 'bg-green-100 text-green-800' },
  sent: { label: 'Enviada', color: 'bg-blue-100 text-blue-800' },
  accepted: { label: 'Aceptada', color: 'bg-emerald-100 text-emerald-800' },
};

export function QuotesTable({ quotes, filteredQuotes, onDelete }: QuotesTableProps) {
  if (filteredQuotes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-slate-600 mb-4">
          {quotes.length === 0
            ? 'No tienes cotizaciones aún'
            : 'No se encontraron cotizaciones con los filtros aplicados'}
        </p>
        {quotes.length === 0 && (
          <Link
            href="/dashboard?new=true"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Crear Primera Cotización
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Proyecto
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Tarifa
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Horas Est.
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map((quote) => {
              const estimatedHours = quote.minimumHours || 40;
              const estimatedValue = quote.hourlyRate * estimatedHours;
              const config = statusConfig[quote.status];

              return (
                <tr
                  key={quote.id}
                  className="border-b border-slate-200 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900 truncate">
                        {quote.description.substring(0, 50)}...
                      </p>
                      <p className="text-sm text-slate-500">
                        Valor est: ${estimatedValue.toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">
                    ${quote.hourlyRate}/h
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {estimatedHours}h
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                      {config.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {new Date(quote.createdAt).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 flex gap-2 items-center">
                    <Link
                      href={`/quote/${quote.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Ver →
                    </Link>
                    <button
                      onClick={() => onDelete(quote.id)}
                      className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
