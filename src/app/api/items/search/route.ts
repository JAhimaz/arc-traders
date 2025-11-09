// app/api/items/search/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Item } from '@/components/types';

export const runtime = 'edge';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // anon is fine for public search
  { global: { fetch } }
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();

  if (q.length < 3) {
    return NextResponse.json([], { headers: { 'content-type': 'application/json' } });
  }

  try {
    // call the RPC you actually created below
    const { data, error } = await supabase.rpc('search_ar_items_full', { q_input: q });
    if (error) {
      console.error('RPC error:', error);
      throw error;
    }

    const results: Item[] = (data || []).map((r: any) => ({
      id: r.id,
      item_id: r.item_id,
      name: r.name,
      description: r.description,
      icon: r.icon,
      item_type: r.item_type,
      loadout_slots: r.loadout_slots,
      rarity: r.rarity,
      value: r.value,
    }));

    return NextResponse.json(results, {
      headers: {
        'cache-control': 'public, max-age=30, stale-while-revalidate=120',
      },
    });
  } catch (e: any) {
    // surface a minimal hint during dev
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
