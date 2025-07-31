import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
    matcher: [
        '/((?!_next|.*\\..*).*)',     // Matches all app + API routes
        '/api/socket/io',            // 👈 specifically match socket route
    ],
};


