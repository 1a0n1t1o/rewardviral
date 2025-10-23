import { NextResponse } from 'next/server';
import { readIdentity } from '@/lib/identity';

export function GET() {
  const status = readIdentity();
  return NextResponse.json(status, { status: 200 });
}