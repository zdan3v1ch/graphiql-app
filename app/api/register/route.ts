import { NextRequest, NextResponse } from 'next/server';
import { registerWithEmailAndPassword } from '@/lib/firestore/service';

export async function POST(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await request.json();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
  await registerWithEmailAndPassword(body.name, body.email, body.password);

  return NextResponse.json({});
}
