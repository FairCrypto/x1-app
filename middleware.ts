import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ratelimit = new Ratelimit({
  redis: kv as any,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(200, '10 s')
});

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/x1') && process.env.X1_RPC_URL) {
    const body = await request.json();
    return fetch(process.env.X1_RPC_URL, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  if (request.nextUrl.pathname.startsWith('/api/xenblocks')) {
    const path = request.nextUrl.pathname.replace('/api/xenblocks', '');
    const url = `http://xenblocks.io:4447${path}`;
    // console.log(request.nextUrl.pathname, path, url);
    return NextResponse.rewrite(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(`${request.nextUrl.origin}/x1/moon-party`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    }
  ]
};
