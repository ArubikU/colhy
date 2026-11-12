import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { generateQuoteHTML } from '@/lib/json-to-pdf';
import type { QuoteJSON } from '@/types/quote-schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pdfContent, userRequest, aiProvider, aiModel, apiKey, quoteJSON } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key es requerida' },
        { status: 400 }
      );
    }

    const systemPrompt = `Eres un asistente experto para editar cotizaciones. El usuario solicita cambios al documento.

Tienes disponibles estas operaciones:
1. REPLACE: Reemplaza valores en el JSON
2. INSERT: Agrega información nueva
3. DELETE: Elimina información
4. EDIT: Modifica campos específicos

INSTRUCCIONES CRÍTICAS:
- Devuelve ÚNICAMENTE JSON válido sin explicaciones adicionales
- El JSON debe ser 100% válido (escapa caracteres especiales)
- No incluyas código markdown como \`\`\`json\`\`\`
- Mantén la estructura del documento intacta
- Recalcula total = subtotal + taxes si cambias costos
- Actualiza costBreakdown si cambias detalles

El usuario solicita: "${userRequest}"

Realiza los cambios solicitados y devuelve el JSON completo actualizado.`;

    // Try to parse the input JSON (if provided) or work with the HTML
    let currentJSON: QuoteJSON | null = null;
    let currentHTML = pdfContent;

    if (quoteJSON) {
      try {
        currentJSON = typeof quoteJSON === 'string' ? JSON.parse(quoteJSON) : quoteJSON;
      } catch (e) {
        console.log('[Colhy] Could not parse input JSON, working with HTML');
      }
    }

    // Prepare context for the AI
    const context = currentJSON
      ? JSON.stringify(currentJSON, null, 2)
      : `HTML Document:\n${currentHTML}`;

    const userPrompt = `${context}

SOLICITUD DEL USUARIO: ${userRequest}

Por favor, realiza los cambios solicitados. Si trabajas con JSON, devuelve el JSON completo actualizado. Si trabajas con HTML, devuelve el HTML completo actualizado.`;

    const { text: response } = await generateText({
      model: `${aiProvider}/${aiModel}`,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.5,
      maxOutputTokens: 4000,
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
    });

    // Try to parse JSON response first
    let updatedJSON: QuoteJSON | null = null;
    let updatedContent = pdfContent;
    let updatedHTML = currentHTML;

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      updatedJSON = JSON.parse(jsonString) as QuoteJSON;
      updatedHTML = generateQuoteHTML(updatedJSON);
      updatedContent = updatedHTML;
      console.log('[Colhy] Updated JSON parsed and HTML regenerated');
    } catch (jsonError) {
      // If JSON parsing fails, try to extract HTML
      const htmlMatch = response.match(/```html\n([\s\S]*?)\n```/);
      if (htmlMatch && htmlMatch[1]) {
        updatedContent = htmlMatch[1];
      }
      console.log('[Colhy] Using HTML update from response');
    }

    return NextResponse.json({
      success: true,
      response,
      updatedContent,
      updatedJSON: updatedJSON || undefined,
    });
  } catch (error) {
    console.error('[Colhy] PDF editor error:', error);
    const message =
      error instanceof Error ? error.message : 'Error al editar el documento';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
