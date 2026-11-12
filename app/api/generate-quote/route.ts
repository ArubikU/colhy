import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { buildQuotePrompt, getAIModel, type AIProvider } from '@/lib/ai-service';
import { quoteSchema } from '@/lib/schemas/quote';
import { enrichQuoteContext } from '@/lib/web-search';
import { generateQuoteHTML } from '@/lib/json-to-pdf';
import { db } from '@/lib/db';
import { quotes, consultantSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { QuoteJSON } from '@/types/quote-schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let {
      quoteId,
      description,
      pricePerHour,
      technologies,
      extraDetails,
      minHours,
      teamMembers,
      provider,
      modelId,
      apiKey,
    } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key es requerida' },
        { status: 400 }
      );
    }

    // Enrich context with web search and tech analysis
    console.log('[Colhy] Enriching quote context with tech analysis...');
    const webContext = await enrichQuoteContext(description, technologies);

    // Build prompts
    let { system, user } = buildQuotePrompt({
      description,
      pricePerHour,
      technologies,
      extraDetails,
      minHours,
      teamMembers,
    });

    // Add web-enriched context to the user prompt
    user = `${user}\n\n=== CONTEXTO TÉCNICO (Análisis Automatizado) ===\n${webContext}`;

    const model = getAIModel(provider as AIProvider, modelId, apiKey);

    console.log('[Colhy] Generating quote with model:', modelId);

    // Generate quote using AI SDK v5
    const { object: quoteJSON, usage } = await generateObject({
      model,
      system,
      prompt: user,
      schema: quoteSchema,
      temperature: 0.7,
    });

    console.log('[Colhy] Quote generated successfully. Tokens used:', usage);

    // Generate PDF HTML from JSON
    // @ts-ignore
    const pdfHTML = generateQuoteHTML(quoteJSON);
    console.log('[Colhy] PDF HTML generated successfully');

    // Update quote in database with both JSON and PDF
    await db.update(quotes)
      .set({
        generatedQuote: pdfHTML, // Accessing the correct column from schema
        quoteData: quoteJSON,    // Saving structured JSON
        status: 'pending',
        updatedAt: new Date(),
      })
      .where(eq(quotes.id, quoteId));

    return NextResponse.json({
      success: true,
      quoteJSON, // Return the structured JSON
      quoteContent: pdfHTML, // Return the PDF HTML for display
      usage,
    });
  } catch (error) {
    console.error('[Colhy] Quote generation error:', error);
    const message =
      error instanceof Error ? error.message : 'Error desconocido al generar cotización';
    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}
