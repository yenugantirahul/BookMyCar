import { type NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/proxy';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  return proxyRequest(`/api/v1/bookings/${id}/cancel`, 'PATCH', body);
}
