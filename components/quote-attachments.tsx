'use client';

import { useState } from 'react';
import { getFileIcon, formatFileSize } from '@/lib/file-processor';

interface Attachment {
  id: string;
  fileName: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

interface QuoteAttachmentsProps {
  attachments: Attachment[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

export function QuoteAttachments({
  attachments,
  isLoading = false,
  onDelete,
}: QuoteAttachmentsProps) {
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null);

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p className="text-sm">No hay archivos adjuntos en esta cotización</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl flex-shrink-0">
                {getFileIcon(attachment.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {attachment.fileName}
                </p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(attachment.size)}
                </p>
              </div>
            </div>

            {/* Preview for images */}
            {attachment.type.startsWith('image/') && (
              <button
                onClick={() =>
                  setExpandedPreview(
                    expandedPreview === attachment.id ? null : attachment.id
                  )
                }
                className="w-full mb-3 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition"
              >
                {expandedPreview === attachment.id ? 'Ocultar' : 'Ver'} Imagen
              </button>
            )}

            {/* Preview content */}
            {expandedPreview === attachment.id && attachment.type.startsWith('image/') && (
              <div className="mb-3 bg-slate-50 rounded p-2">
                <img
                  src={attachment.url || "/placeholder.svg"}
                  alt={attachment.fileName}
                  className="w-full h-auto max-h-64 object-contain rounded"
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <a
                href={attachment.url}
                download
                className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-center"
              >
                Descargar
              </a>
              {onDelete && (
                <button
                  onClick={() => onDelete(attachment.id)}
                  disabled={isLoading}
                  className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50"
                >
                  Eliminar
                </button>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-2">
              {new Date(attachment.uploadedAt).toLocaleDateString('es-ES')}
            </p>
          </div>
        ))}
      </div>

      {/* Expanded image preview modal */}
      {expandedPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-96 overflow-auto">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Vista Previa de Imagen</h3>
              <button
                onClick={() => setExpandedPreview(null)}
                className="text-slate-600 hover:text-slate-900"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <img
                src={
                  attachments.find((a) => a.id === expandedPreview)?.url || ''
                }
                alt="preview"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
