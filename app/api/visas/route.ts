import { NextRequest, NextResponse } from 'next/server';
import { getAllVisas, createVisa } from '@/lib/db';

export async function GET() {
  try {
    const visas = await getAllVisas();
    return NextResponse.json({ success: true, data: visas });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newVisa = await createVisa(body);
    return NextResponse.json({ success: true, data: newVisa }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
