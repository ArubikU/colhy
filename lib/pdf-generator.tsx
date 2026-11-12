import type { TeamMember } from '@/types';

export interface QuoteData {
  id: string;
  description: string;
  pricePerHour: number;
  technologies: string[];
  extraDetails: string;
  minHours: number | null;
  teamMembers: TeamMember[];
  quoteContent: string;
  clientName?: string;
  clientEmail?: string;
  createdAt: string;
}

/**
 * Generate an editable PDF with signature lines based on team members
 * Returns HTML that can be rendered or converted to PDF
 */
export function generatePDFHTML(quote: QuoteData): string {
  const signaturesHTML = quote.teamMembers
    .map(
      (member) => `
    <div style="margin-top: 40px; display: inline-block; margin-right: 80px;">
      <div style="border-top: 2px solid #000; width: 250px; margin-bottom: 5px;"></div>
      <p style="margin: 0; font-size: 12px; font-weight: bold;">${member.name}</p>
      <p style="margin: 0; font-size: 11px; color: #666;">${member.role}</p>
      <p style="margin: 5px 0 0 0; font-size: 10px; color: #999;">Fecha: __________</p>
    </div>
  `
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cotización - ${quote.id}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 40px;
    }
    
    .page {
      background: white;
      max-width: 900px;
      margin: 0 auto;
      padding: 60px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      break-after: page;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
    }
    
    .header h1 {
      color: #1e40af;
      font-size: 28px;
      margin-bottom: 5px;
    }
    
    .header p {
      color: #666;
      font-size: 14px;
    }
    
    .quote-id {
      background: #dbeafe;
      color: #1e40af;
      padding: 8px 16px;
      border-radius: 4px;
      display: inline-block;
      font-size: 12px;
      font-weight: bold;
      margin-top: 10px;
    }
    
    .content {
      margin-bottom: 40px;
    }
    
    .quote-section {
      background: #f9fafb;
      padding: 20px;
      margin: 20px 0;
      border-left: 4px solid #2563eb;
      border-radius: 4px;
    }
    
    .quote-section h2 {
      color: #1e40af;
      font-size: 16px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .quote-html {
      background: white;
      padding: 20px;
      margin: 20px 0;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      line-height: 1.8;
    }
    
    .signatures {
      margin-top: 60px;
      padding-top: 40px;
      border-top: 2px solid #ddd;
    }
    
    .signatures h3 {
      color: #333;
      font-size: 14px;
      margin-bottom: 30px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .signature-block {
      margin-bottom: 40px;
    }
    
    .signature-line {
      border-top: 2px solid #000;
      width: 250px;
      margin-bottom: 5px;
    }
    
    .signature-name {
      font-weight: bold;
      font-size: 13px;
      margin: 5px 0 0 0;
    }
    
    .signature-role {
      color: #666;
      font-size: 12px;
      margin: 2px 0 0 0;
    }
    
    .signature-date {
      color: #999;
      font-size: 11px;
      margin: 10px 0 0 0;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 11px;
      color: #999;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .page {
        box-shadow: none;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <h1>COTIZACIÓN PROFESIONAL</h1>
      <p>Análisis y Propuesta Integral del Proyecto</p>
      <div class="quote-id">ID: ${quote.id}</div>
    </div>
    
    <!-- Quote Content -->
    <div class="content">
      <div class="quote-section">
        <h2>📋 Descripción del Proyecto</h2>
        <p>${quote.description}</p>
      </div>
      
      <div class="quote-section">
        <h2>💾 Detalles de la Propuesta</h2>
        <div class="quote-html">
          ${quote.quoteContent}
        </div>
      </div>
      
      ${
        quote.extraDetails
          ? `
        <div class="quote-section">
          <h2>📝 Detalles Adicionales</h2>
          <p>${quote.extraDetails}</p>
        </div>
      `
          : ''
      }
    </div>
    
    <!-- Signatures -->
    <div class="signatures">
      <h3>✍️ Firmas Autorizadas</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 40px;">
        ${quote.teamMembers
          .map(
            (member) => `
          <div class="signature-block">
            <div class="signature-line"></div>
            <p class="signature-name">${member.name}</p>
            <p class="signature-role">${member.role}</p>
            <p class="signature-date">Fecha: _______________</p>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>Generado el ${new Date(quote.createdAt).toLocaleDateString('es-ES')} | Cotización válida por 30 días</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Convert HTML to blob for download
 */
export function downloadPDF(html: string, filename: string): void {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
