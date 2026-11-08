import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function handle(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyToBackend(req, `/uploads/${path.join('/')}`);
}

export const GET = handle;
export const HEAD = handle;
export const POST = handle;
