import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from('documents')
    .insert([body])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
