'use client';

import { useEffect, useState } from 'react';

interface GenerationStatusProps {
  isGenerating: boolean;
  error?: string;
  progress: number;
}

const steps = [
  'Conectando con IA...',
  'Analizando proyecto...',
  'Calculando costos...',
  'Estimando cronograma...',
  'Generando documento...',
  'Finalizando...',
];

export function QuoteGenerationStatus({
  isGenerating,
  error,
  progress,
}: GenerationStatusProps) {
  const [displayedSteps, setDisplayedSteps] = useState(1);

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setDisplayedSteps((prev) => Math.min(prev + 1, steps.length));
    }, 1000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating && !error) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        {error ? (
          <>
            <div className="text-center">
              <div className="text-red-600 text-4xl mb-4">✕</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Error</h3>
              <p className="text-slate-600">{error}</p>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-slate-900 mb-6 text-center">
              Generando Cotización
            </h3>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(displayedSteps / steps.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-slate-500 mt-2 text-center">
                {displayedSteps} de {steps.length} pasos
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-opacity ${
                    index < displayedSteps
                      ? 'opacity-100'
                      : 'opacity-50'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      index < displayedSteps - 1
                        ? 'bg-green-500 text-white'
                        : index === displayedSteps - 1
                          ? 'bg-blue-500 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {index < displayedSteps - 1 ? '✓' : index === displayedSteps - 1 ? '⚡' : index + 1}
                  </div>
                  <span className="text-sm text-slate-700">{step}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 mt-6 text-center">
              Por favor, no cierres esta ventana...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
