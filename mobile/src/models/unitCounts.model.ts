import { supabase } from '@/src/lib/supabase';

/** House count per building, for the block-picker labels ("Block A · 12"). */
export async function countUnitsByBuilding(buildingIds: number[]): Promise<Record<number, number>> {
  if (buildingIds.length === 0) return {};
  const { data, error } = await supabase.from('units').select('id, building_id').in('building_id', buildingIds);
  if (error) throw error;
  const counts: Record<number, number> = {};
  for (const row of data ?? []) counts[row.building_id] = (counts[row.building_id] ?? 0) + 1;
  return counts;
}
