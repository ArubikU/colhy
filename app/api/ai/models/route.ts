
import { NextResponse } from 'next/server';
import { getActiveModels } from '@/lib/ai';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const models = await getActiveModels();
        return NextResponse.json(models);
    } catch (error) {
        console.error('Error fetching AI models:', error);
        return NextResponse.json(
            { error: 'Failed to fetch models' },
            { status: 500 }
        );
    }
}
