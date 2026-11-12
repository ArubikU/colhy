'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type AIProvider = 'openai' | 'cohere';

interface PDFEditorChatProps {
  quoteData: any | null;
  onQuoteUpdate: (updatedQuote: any) => void;
  currentMetadata?: {
    hourlyRate?: number;
    estimatedHours?: number;
    totalAmount?: number;
    description?: string;
    lang?: string;
  };
  onMetadataUpdate?: (updatedMetadata: any) => void;
  aiProvider: AIProvider;
  aiModel: string;
  apiKey: string;
}

export function PDFEditorChat({ quoteData, onQuoteUpdate, currentMetadata, onMetadataUpdate, aiProvider, aiModel, apiKey }: PDFEditorChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call API route to update structured data
      const response = await fetch('/api/chat/update-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentQuote: quoteData,
          currentMetadata: currentMetadata || {},
          userInstruction: input,
          provider: aiProvider,
          modelId: aiModel,
          apiKey: apiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la API');
      }

      const { updatedQuote, updatedMetadata, response: apiResponse } = data;

      if (updatedQuote) {
        onQuoteUpdate(updatedQuote);
      }

      if (updatedMetadata && onMetadataUpdate) {
        onMetadataUpdate(updatedMetadata);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: apiResponse || 'He actualizado la cotización según tus instrucciones.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('[Colhy] Error in PDF editor chat:', error);
      const msg = error instanceof Error ? error.message : 'Error al procesar tu solicitud';
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${msg}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 ">
        <h3 className="font-semibold">Asistente de Edición de Cotización</h3>
        <p className="text-sm text-blue-100">
          Pídeme cambios al documento y los realizaré automáticamente
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            <p className="text-sm">
              ¿Qué cambios deseas hacer en la cotización? Puedo:
            </p>
            <ul className="mt-2 text-xs text-slate-600 space-y-1">
              <li>✏️ Editar texto</li>
              <li>➕ Agregar secciones</li>
              <li>➖ Eliminar contenido</li>
              <li>🎨 Cambiar formato</li>
            </ul>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-slate-100 text-slate-900 rounded-bl-none'
                }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p
                className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                  }`}
              >
                {msg.timestamp.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg rounded-bl-none">
              <p className="text-sm">Procesando solicitud...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-4 bg-slate-50 rounded-b-lg">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey && !loading) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Escribe cambios que deseas hacer... (Ctrl+Enter para enviar)"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[80px] max-h-[200px]"
            disabled={loading}
            rows={3}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition"
          >
            {loading ? '...' : '📤'}
          </button>
        </div>
      </div>
    </div>
  );
}
