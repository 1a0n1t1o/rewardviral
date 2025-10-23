import { NextResponse } from 'next/server';
import { getIdentity } from '@/lib/identity';

export async function GET(req: Request) {
  const { userId, userToken } = getIdentity(req);
  return NextResponse.json({ userId, userToken }, { status: 200 });
}