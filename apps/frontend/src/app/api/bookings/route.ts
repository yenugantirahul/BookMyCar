import { type NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  return proxyRequest(`/api/v1/bookings?${searchParams.toString()}`, 'GET');
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyRequest('/api/v1/bookings', 'POST', body);
}
