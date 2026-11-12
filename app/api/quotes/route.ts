
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quotes, users } from '@/lib/db/schema';
import { verifyToken } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const jwtPayload = session ? await verifyToken(session) : null;

  if (!jwtPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await db.select()
      .from(quotes)
      .where(eq(quotes.consultantId, jwtPayload.sub as string))
      .orderBy(desc(quotes.createdAt));
    return NextResponse.json({ quotes: result });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const jwtPayload = session ? await verifyToken(session) : null;

  if (!jwtPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const userId = jwtPayload.sub as string;

    // Validation...

    const [newQuote] = await db.insert(quotes).values({
      consultantId: userId,
      title: 'Nueva Cotización',
      description: body.description || 'Nueva cotización',
      hourlyRate: body.pricePerHour ? String(body.pricePerHour) : null,
      minimumHours: body.minHours ? String(body.minHours) : null,
      technologies: body.technologies || [],
      teamMembers: body.teamMembers,
      extraDetails: body.extraDetails,
      quoteData: null,
      generatedQuote: null,
      lang: body.lang || 'es',
      status: 'draft',
    }).returning();

    return NextResponse.json({ success: true, quoteId: newQuote.id });
  } catch (error) {
    console.error('Quote create error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
