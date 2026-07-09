import { type NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  return proxyRequest('/api/v1/users', 'GET');
}
