import { supabase } from '@/src/lib/supabase';
import { Tables } from '@/src/types/database';

export type Building = Tables<'buildings'>;

export async function listBuildings(): Promise<Building[]> {
  const { data, error } = await supabase.from('buildings').select('*').order('name');
  if (error) throw error;
  return data;
}
