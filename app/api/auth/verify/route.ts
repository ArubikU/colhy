
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { signToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
        return NextResponse.redirect(new URL('/login?error=Invalid+Link', request.url));
    }

    try {
        // Verify token exists and is not expired
        const [storedToken] = await db
            .select()
            .from(verificationTokens)
            .where(
                and(
                    eq(verificationTokens.token, token),
                    eq(verificationTokens.identifier, email),
                    gt(verificationTokens.expires, new Date())
                )
            );

        if (!storedToken) {
            return NextResponse.redirect(new URL('/login?error=Expired+or+Invalid', request.url));
        }

        // Fetch user
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) {
            return NextResponse.redirect(new URL('/login?error=User+Not+Found', request.url));
        }

        // Clean up used token
        await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

        // Create session JWT
        const jwt = await signToken({ sub: user.id, email: user.email, role: user.userType });

        const response = NextResponse.redirect(new URL('/dashboard', request.url));
        response.cookies.set('session', jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.redirect(new URL('/login?error=Server+Error', request.url));
    }
}
