
import { db } from '@/lib/db';
import { aiModels } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

const models = [
    // Cohere Models
    {
        id: 'command-a-03-2025',
        name: 'Command A 03-2025',
        provider: 'cohere',
        status: 'Live',
        description: 'Command A is our most performant model to date, excelling at tool use, agents, retrieval augmented generation (RAG), and multilingual use cases. Command A has a context length of 256K.',
        modality: 'Text',
        contextLength: '256k',
        maxOutputTokens: '8k',
    },
    {
        id: 'command-r7b-12-2024',
        name: 'Command R7B 12-2024',
        provider: 'cohere',
        status: 'Live',
        description: 'A small, fast update delivered in December 2024. Excels at RAG, tool use, agents, and complex reasoning.',
        modality: 'Text',
        contextLength: '128k',
        maxOutputTokens: '4k',
    },
    {
        id: 'command-a-translate-08-2025',
        name: 'Command A Translate',
        provider: 'cohere',
        status: 'Live',
        description: 'State of the art machine translation model excelling at 23 languages.',
        modality: 'Text',
        contextLength: '8K',
        maxOutputTokens: '8k',
    },
    {
        id: 'command-a-reasoning-08-2025',
        name: 'Command A Reasoning',
        provider: 'cohere',
        status: 'Live',
        description: 'First reasoning model, able to think before generating an output for complex problem-solving.',
        modality: 'Text',
        contextLength: '256k',
        maxOutputTokens: '32k',
    },
    {
        id: 'command-a-vision-07-2025',
        name: 'Command A Vision',
        provider: 'cohere',
        status: 'Live',
        description: 'First model capable of processing images, excelling in analyzing charts, graphs, OCR, and document Q&A.',
        modality: 'Text, Images',
        contextLength: '128K',
        maxOutputTokens: '8K',
    },
    {
        id: 'command-r-08-2024',
        name: 'Command R 08-2024',
        provider: 'cohere',
        status: 'Live',
        description: 'Update of the Command R model, delivered in August 2024.',
        modality: 'Text',
        contextLength: '128k',
        maxOutputTokens: '4k',
    },
    {
        id: 'command-r-plus-08-2024',
        name: 'Command R+ 08-2024',
        provider: 'cohere',
        status: 'Live',
        description: 'Update of the Command R+ model, delivered in August 2024.',
        modality: 'Text',
        contextLength: '128k',
        maxOutputTokens: '4k',
    },
    {
        id: 'command-r-03-2024',
        name: 'Command R',
        provider: 'cohere',
        status: 'Deprecated',
        description: 'Instruction-following conversational model for complex workflows like RAG and tool use.',
        modality: 'Text',
        contextLength: '128k',
        maxOutputTokens: '4k',
    },
    {
        id: 'command-r-plus-04-2024',
        name: 'Command R+',
        provider: 'cohere',
        status: 'Deprecated',
        description: 'Best suited for complex RAG workflows and multi-step tool use.',
        modality: 'Text',
        contextLength: '128k',
        maxOutputTokens: '4k',
    },
    {
        id: 'command-r-plus',
        name: 'Command R+ (Alias)',
        provider: 'cohere',
        status: 'Deprecated',
        description: 'Alias for command-r-plus-04-2024',
        modality: 'Text',
        contextLength: '128k',
        maxOutputTokens: '4k',
    },
    {
        id: 'command-r',
        name: 'Command R (Alias)',
        provider: 'cohere',
        status: 'Deprecated',
        description: 'Alias for command-r-03-2024',
        modality: 'Text',
        contextLength: '128k',
        maxOutputTokens: '4k',
    },
    {
        id: 'command-light',
        name: 'Command Light',
        provider: 'cohere',
        status: 'Deprecated',
        description: 'A smaller, faster version of command.',
        modality: 'Text',
        contextLength: '4k',
        maxOutputTokens: '4k',
    },
    {
        id: 'command',
        name: 'Command',
        provider: 'cohere',
        status: 'Deprecated',
        description: 'Instruction-following conversational model.',
        modality: 'Text',
        contextLength: '4k',
        maxOutputTokens: '4k',
    },

    {
        id: 'gpt-5',
        name: 'GPT-5',
        provider: 'openai',
        status: 'Live',
        description: 'Flagship multimodal reasoning model with top-tier performance across coding, analysis, and complex instruction tasks.',
        modality: 'Text, Images',
        contextLength: '200k+',
        maxOutputTokens: '8k+',
    },
    {
        id: 'gpt-5-2',
        name: 'GPT-5.2',
        provider: 'openai',
        status: 'Live',
        description: 'Improved GPT-5 generation with stronger reasoning stability, better tool use, and higher reliability.',
        modality: 'Text, Images',
        contextLength: '200k+',
        maxOutputTokens: '8k+',
    },
    {
        id: 'gpt-5-mini',
        name: 'GPT-5 Mini',
        provider: 'openai',
        status: 'Live',
        description: 'Lightweight, faster, and more cost-efficient GPT-5 variant for high-throughput workloads.',
        modality: 'Text',
        contextLength: '128k',
        maxOutputTokens: '4k+',
    },
    {
        id: 'gpt-5-2-mini',
        name: 'GPT-5.2 Mini',
        provider: 'openai',
        status: 'Live',
        description: 'Optimized mini version of GPT-5.2 with improved reasoning per token and lower latency.',
        modality: 'Text',
        contextLength: '128k',
        maxOutputTokens: '4k+',
    },
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        status: 'Legacy',
        description: 'Previous flagship multimodal model, now maintained for backward compatibility.',
        modality: 'Text, Images',
        contextLength: '128k',
        maxOutputTokens: '4k',
    },
    {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        status: 'Legacy',
        description: 'Earlier GPT-4 optimized version with improved speed and lower cost.',
        modality: 'Text',
        contextLength: '128k',
        maxOutputTokens: '4k',
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        status: 'Deprecated',
        description: 'Older cost-effective model retained for legacy systems.',
        modality: 'Text',
        contextLength: '16k',
        maxOutputTokens: '4k',
    }
];

async function seed() {
    console.log('Seeding models...');

    for (const model of models) {
        const capabilities = [];
        if (model.modality.includes('Images')) capabilities.push('vision');
        if (model.description.toLowerCase().includes('reasoning')) capabilities.push('reasoning');

        const isActive = model.status === 'Live';

        await db.insert(aiModels).values({
            id: model.id,
            name: model.name,
            provider: model.provider as 'openai' | 'cohere',
            description: model.description,
            capabilities: capabilities,
            isActive: isActive
        }).onConflictDoUpdate({
            target: aiModels.id,
            set: {
                name: model.name,
                description: model.description,
                capabilities: capabilities,
                isActive: isActive
            }
        });

        console.log(`Upserted ${model.id}`);
    }

    console.log('Done!');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seeding failed', err);
    process.exit(1);
});
