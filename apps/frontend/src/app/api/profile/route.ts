import { NextResponse, type NextRequest } from 'next/server';

const MOCK_PROFILE = {
  success: true,
  data: {
    id: 'mock-user-123',
    email: 'demo@example.com',
    fullName: 'Demo User',
    role: 'admin',
    phone: '+91 98765 43210',
    avatarUrl: null
  }
};

export async function GET(request: NextRequest) {
  // Return dummy data instead of proxying to offline backend
  return NextResponse.json(MOCK_PROFILE);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  
  // Simulate successful profile update by merging payload
  return NextResponse.json({
    success: true,
    data: {
      ...MOCK_PROFILE.data,
      ...body
    }
  });
}
