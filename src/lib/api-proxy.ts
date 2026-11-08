import { NextRequest, NextResponse } from 'next/server';

function backendOrigin() {
  const origin = process.env.API_ORIGIN || process.env.NEXT_PUBLIC_API_ORIGIN;
  if (origin) return origin.replace(/\/$/, '');
  const url = process.env.NEXT_PUBLIC_API_URL ?? '';
  if (url) return url.replace(/\/api\/v1\/?$/, '');
  if (process.env.NODE_ENV === 'production') {
    return 'https://api-production-eb86d.up.railway.app';
  }
  return 'http://localhost:4000';
}

export async function proxyToBackend(req: NextRequest, pathname: string) {
  const headers = new Headers();
  const cookie = req.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);
  const contentType = req.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  const accept = req.headers.get('accept');
  if (accept) headers.set('accept', accept);

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const response = await fetch(
    `${backendOrigin()}${pathname}${req.nextUrl.search}`,
    {
      method: req.method,
      headers,
      body,
      redirect: 'manual',
      cache: 'no-store',
    },
  );

  const out = new Headers();
  const resType = response.headers.get('content-type');
  if (resType) out.set('content-type', resType);

  return new NextResponse(response.body, { status: response.status, headers: out });
}
