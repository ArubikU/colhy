
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendLoginEmail, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user exists, if not create them (or handle signup separately)
        // For now, auto-signup
        let user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            const [newUser] = await db.insert(users).values({ email, userType: 'client' }).returning();
            user = newUser;
        }

        // Generate token
        const token = await signToken({ email, sub: user.id });

        // Save token as a "magic link" identifier (simplified for now, usually we replace this with robust flow)
        // Actually, for magic links we usually generate a random nonce, save it, and email it.
        // Let's implement standard magic link:
        // 1. Generate unique code
        const magicCode = Math.random().toString(36).substring(2, 15);
        const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 mins

        await db.insert(verificationTokens).values({
            identifier: email,
            token: magicCode,
            expires
        });

        const url = new URL('/api/auth/verify', request.url);
        url.searchParams.set('token', magicCode);
        url.searchParams.set('email', email);

        await sendLoginEmail(email, url.toString());

        return NextResponse.json({ success: true, message: 'Magic link sent' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
