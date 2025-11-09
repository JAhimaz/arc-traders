/* eslint-disable no-console */
import "dotenv/config";
import { supabaseAdmin } from "../utils/supabase/admin";

type ApiItem = {
  id: string;
  name: string;
  description: string | null;
  item_type: string | null;
  loadout_slots: string[] | null;
  icon: string | null;
  rarity: string | null;
  value: number | null;
};

type ApiResponse = {
  data: ApiItem[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

const API_BASE = "https://metaforge.app/api/arc-raiders/items";
const PAGE_LIMIT = 50;         // API page size
const FETCH_DELAY_MS = 350;    // delay between API requests
const UPSERT_BATCH_SIZE = 500; // DB batch size
const DB_DELAY_MS = 250;       // delay between DB batches

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function toDbRow(i: ApiItem) {
  return {
    item_id: i.id,
    name: i.name ?? null,
    description: i.description ?? null,
    item_type: i.item_type ?? null,
    loadout_slots: JSON.stringify(i.loadout_slots ?? []), // store as stringified array
    icon: i.icon ?? null,
    rarity: i.rarity ?? null,
    value: i.value ?? null,
  };
}

async function fetchPage(page: number): Promise<ApiResponse> {
  const url = `${API_BASE}?page=${page}&limit=${PAGE_LIMIT}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchAll(): Promise<{ items: ApiItem[]; apiCount: number }> {
  let page = 1;
  const all: ApiItem[] = [];
  let expectedTotal: number | undefined;

  // Pull pages until empty/short page or totalPages reached
  while (true) {
    const resp = await fetchPage(page);
    const { data } = resp;

    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);

    if (typeof resp.total === "number") expectedTotal = resp.total;

    if (typeof resp.totalPages === "number" && typeof resp.page === "number") {
      if (resp.page >= resp.totalPages) break;
    } else if (data.length < PAGE_LIMIT) {
      break;
    }

    page += 1;
    await sleep(FETCH_DELAY_MS);
  }

  return { items: all, apiCount: expectedTotal ?? all.length };
}

async function dbCount(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("ar_items")
    .select("id", { head: true, count: "exact" });
  if (error) throw error;
  return count ?? 0;
}

async function upsertRows(rows: any[]) {
  for (let i = 0; i < rows.length; i += UPSERT_BATCH_SIZE) {
    const chunk = rows.slice(i, i + UPSERT_BATCH_SIZE);
    const { error } = await supabaseAdmin
      .from("ar_items")
      .upsert(chunk, { onConflict: "item_id", ignoreDuplicates: false });
    if (error) throw error;
    await sleep(DB_DELAY_MS);
  }
}

async function main() {
  // Safety checks
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  }

  console.log("➡️  Fetching from API…");
  const { items, apiCount } = await fetchAll();
  console.log(`   Got ${items.length} items (API reports total: ${apiCount})`);

  console.log("🧮 Counting DB before…");
  const before = await dbCount();
  console.log(`   DB count: ${before}`);

  console.log("⬆️  Upserting into DB (by item_id) in batches…");
  const rows = items.map(toDbRow);
  await upsertRows(rows);

  console.log("🧮 Counting DB after…");
  const after = await dbCount();
  console.log(`   DB count: ${after}`);

  const countsMatch = after === apiCount;
  console.log("—— Summary ——");
  console.log(`API total: ${apiCount}`);
  console.log(`DB total : ${after}`);
  if (countsMatch) {
    console.log("✅ Counts match. Sync complete.");
  } else {
    console.warn("⚠️ Count mismatch. Investigate missing/extra rows or schema differences.");
  }
}

main().catch((e) => {
  console.error("Sync failed:", e?.message || e);
  process.exit(1);
});
