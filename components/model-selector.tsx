import { AIModel } from '@/lib/ai';

interface ModelSelectorProps {
  models: AIModel[];
  provider: 'openai' | 'cohere';
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelector({
  models,
  provider,
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {

  const providerModels = models.filter(m => m.provider === provider);


  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-900 mb-2">
        Modelo de IA
      </label>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {providerModels.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} - {model.description}
          </option>
        ))}
      </select>

      {/* Model info */}
      {selectedModel && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          {(() => {
            const model = providerModels.find((m) => m.id === selectedModel);
            return model ? (
              <div className="text-sm text-slate-700">
                <p className="font-medium">{model.name}</p>
                <p className="text-slate-600 mt-1">{model.description}</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {model.capabilities!.map((cap) => (
                    <span
                      key={cap}
                      className="inline-block px-2 py-1 bg-blue-200 text-blue-900 text-xs rounded"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}
