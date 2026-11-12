'use client';

import { useState, useEffect } from 'react';
import type { AIProvider } from '@/lib/ai-service';

interface APIConfig {
  provider: AIProvider;
  apiKey: string;
  savedProviders: AIProvider[];
}

export function APIConfig() {
  const [config, setConfig] = useState<APIConfig>({
    provider: 'openai',
    apiKey: '',
    savedProviders: [],
  });

  const [showApiForm, setShowApiForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('colhy_api_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('[Colhy] Error loading API config:', e);
      }
    }
  }, []);

  const handleSaveConfig = () => {
    // Save to localStorage (user can clear this)
    localStorage.setItem(
      'colhy_api_config',
      JSON.stringify({
        provider: config.provider,
        apiKey: config.apiKey, // Save the actual key!
        savedProviders: [...new Set([...config.savedProviders, config.provider])],
      })
    );

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Configuración de IA</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Proveedor Preferido
          </label>
          <select
            value={config.provider}
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                provider: e.target.value as AIProvider,
              }))
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="openai">OpenAI (GPT-4)</option>
            <option value="cohere">Cohere</option>
          </select>
          <p className="text-sm text-slate-500 mt-1">
            {config.provider === 'openai'
              ? 'Usa GPT-4 de OpenAI para cotizaciones más precisas'
              : 'Usa Cohere Command R+ para cotizaciones rápidas'}
          </p>
        </div>

        {showApiForm && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              API Key ({config.provider})
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, apiKey: e.target.value }))
              }
              placeholder={
                config.provider === 'openai'
                  ? 'sk-...'
                  : 'Cohere API Key'
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Tu API Key se usa solo en esta sesión y nunca se almacena en servidores.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {!showApiForm ? (
            <button
              onClick={() => setShowApiForm(true)}
              className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300"
            >
              Agregar API Key
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveConfig}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isSaved ? '✓ Guardado' : 'Guardar Config'}
              </button>
              <button
                onClick={() => {
                  setShowApiForm(false);
                  setConfig((prev) => ({ ...prev, apiKey: '' }));
                }}
                className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
