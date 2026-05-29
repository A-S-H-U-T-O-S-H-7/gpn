import { NextResponse } from 'next/server';

export async function GET(request) {
  const { origin, searchParams } = new URL(request.url);
  const sign = searchParams.get('sign') || 'leo';
  const type = searchParams.get('type') || 'moon';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const params = new URLSearchParams({ sign, type, date });

  const response = await fetch(`${origin}/api/horoscope?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const data = await response.json();

  return NextResponse.json({
    status: response.status,
    data,
  }, { status: response.status });
}
