import { type NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/proxy';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return proxyRequest(`/api/v1/cars/${id}`, 'GET');
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  return proxyRequest(`/api/v1/cars/${id}`, 'PUT', body);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return proxyRequest(`/api/v1/cars/${id}`, 'DELETE');
}
