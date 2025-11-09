export type Item = {
  id: string;
  item_id: string;
  name: string;
  description: string;
  icon: string;
  item_type: string;
  loadout_slots: string; // stringified array
  rarity: string;
  value: number;
}