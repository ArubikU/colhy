
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public paths
    const isPublicPath = path === '/' || path === '/login' || path === '/register' || path.startsWith('/api/auth');

    // get session from cookie
    const session = request.cookies.get('session')?.value;
    const verifiedSession = session ? await verifyToken(session) : null;

    if (path === '/') {
        return NextResponse.next();
    }

    // Don't redirect API routes to dashboard even if logged in
    if (isPublicPath && verifiedSession && !path.startsWith('/api')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!isPublicPath && !verifiedSession) {
        // Exclude static assets/images/etc if necessary, but robust middleware config below handles that usually
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images, public assets
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
