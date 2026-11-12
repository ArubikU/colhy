
import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { getAIModel, type AIProvider } from '@/lib/ai-service';
import { quoteSchema } from '@/lib/schemas/quote';
import { z } from 'zod';

// Schema for quote metadata (top-level quote fields)
const quoteMetadataSchema = z.object({
    hourlyRate: z.number().optional(),
    estimatedHours: z.number().optional(),
    totalAmount: z.number().optional(),
    description: z.string().optional(),
    lang: z.string().optional(),
    revisionId: z.string(),
}); // All fields optional but object structure maintained

// Combined response schema with optional data updates
const quoteUpdateSchema = z.object({
    response: z.string().describe('A natural language response to the user explaining what was done or answering their question'),
    quoteData: quoteSchema.optional().describe('Updated quote data JSON, only if changes were made'),
    metadata: quoteMetadataSchema.optional().describe('Updated metadata fields, only if changes were made'),
});

export async function POST(request: NextRequest) {
    try {
        const { currentQuote, currentMetadata, userInstruction, provider, modelId, apiKey } = await request.json();

        if (!apiKey) {
            return NextResponse.json({ error: 'API Key is required' }, { status: 400 });
        }

        const model = getAIModel(provider as AIProvider, modelId, apiKey);

        const systemPrompt = `You are an expert quote editor assistant. You help users manage and update their quotes.

**Current Quote Data (detailed content):**
${JSON.stringify(currentQuote, null, 2)}

**Current Metadata (top-level fields):**
${JSON.stringify(currentMetadata, null, 2)}

Available metadata fields to edit:
- hourlyRate: The hourly rate for the project (number)
- estimatedHours: Total estimated hours for the project (number)
- totalAmount: Total amount/cost of the project (number)
- description: Brief description of the quote (string)
- lang: Language of the quote - 'es' for Spanish, 'en' for English (string)

**Important Quote Content Fields:**
- quoteData.warrantyPeriod: Use this for warranty terms (e.g., "6 months of technical support")
- quoteData.notes: Use this for general final observations
- quoteData.projectScope: Narrative of what is included/excluded

**Instructions:**
1. ALWAYS provide a "response" field with a natural language message to the user
2. ONLY include "quoteData" if you are making changes to the quote content
3. Set "metadata" to null if no changes, or provide an object with ONLY the fields that changed
4. If the user asks to change "tarifa por hora" or "hourly rate", update metadata.hourlyRate
5. If the user asks to change total hours, update metadata.estimatedHours
6. If the user asks to change the total cost/price, update metadata.totalAmount
7. If the user is just asking a question or requesting information, set metadata to null
8. Maintain JSON structure integrity when making updates
9. Recalculate totals if costs or hours change
10. Keep dates in ISO format (YYYY-MM-DD)

Always be helpful and explain what you did or answer their questions clearly in the response field.`;

        const { object: result } = await generateObject({
            model: model,
            system: systemPrompt,
            prompt: userInstruction,
            schema: quoteUpdateSchema,
            temperature: 0.5,
        });

        return NextResponse.json({
            response: result.response,
            updatedQuote: result.quoteData,
            updatedMetadata: result.metadata
        });
    } catch (error) {
        console.error('Error updating quote data:', error);
        const msg = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
