'use server';

import { generateText, generateObject } from 'ai';
import { getAIModel, type AIProvider } from '@/lib/ai-service';
import { quoteSchema } from '@/lib/schemas/quote';
import type { QuoteJSON } from '@/types/quote-schema';

// Define the interface for the input
interface GeneratePDFInput {
    model: string; // e.g., "openai/gpt-4o"
    system: string;
    prompt: string;
    temperature?: number;
    maxOutputTokens?: number;
    apiKey?: string;
}

interface UpdateQuoteInput {
    currentQuote: QuoteJSON;
    userInstruction: string;
    model: string;
    apiKey?: string;
}

export const serverActions = {
    generatePDFContent: async (input: GeneratePDFInput) => {
        try {
            // Configure the model based on provider logic or input string
            // input.model comes as "openai/gpt-4o" or similar.
            // We need to parse it or handle it.

            const [provider, modelName] = input.model.split('/');

            const model = getAIModel(provider, modelName, input.apiKey);

            const { text } = await generateText({
                model: model,
                system: input.system,
                prompt: input.prompt,
                temperature: input.temperature || 0.7
            });

            return { text };
        } catch (error) {
            console.error('Error generating PDF content:', error);
            throw new Error('Failed to generate content');
        }
    },

    updateQuoteContent: async (input: UpdateQuoteInput) => {
        try {
            const [provider, modelName] = input.model.split('/');
            const model = getAIModel(provider, modelName, input.apiKey);

            const { object } = await generateObject({
                model: model,
                system: 'You are an expert in generating professional quotes. Return the data in the specified JSON format.',
                prompt: `Update the following quote based on the user's instruction. Return the complete updated quote JSON. Do not add extra explanations. Instruction: ${input.userInstruction}`,
                schema: quoteSchema,
                temperature: 0.7
            });

            return { quote: object };
        } catch (error) {
            console.error('Error updating quote content:', error);
            throw new Error('Failed to update quote');
        }
    }
};
