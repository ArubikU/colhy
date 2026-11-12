
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { verifyToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const jwtPayload = session ? await verifyToken(session) : null;

    if (!jwtPayload) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = jwtPayload.sub as string;
        const [user] = await db.select().from(users).where(eq(users.id, userId));

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user_id: user.id,
            role: user.userType,
            company_name: user.companyName,
            full_name: user.fullName,
            // hourly_rate: user.hourlyRate, // Assuming we add this column or map it
            // bio: user.bio // Assuming we add this column
        });
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

        await db.update(users).set({
            userType: body.role,
            companyName: body.company_name,
            fullName: body.full_name,
            // Add other fields to schema if needed
        }).where(eq(users.id, userId));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
