import { supabase } from '@/src/lib/supabase';

/** Most recent meter reading for a unit, before today. */
export async function getLatestReading(unitId: number): Promise<{ reading: number; reading_date: string } | null> {
  const { data, error } = await supabase
    .from('meter_readings')
    .select('reading, reading_date')
    .eq('unit_id', unitId)
    .order('reading_date', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** The last two readings for a unit, most recent first — for a "N units this
 * month vs last month" comparison. */
export async function listRecentReadings(unitId: number, limit = 2): Promise<{ reading: number; reading_date: string }[]> {
  const { data, error } = await supabase
    .from('meter_readings')
    .select('reading, reading_date')
    .eq('unit_id', unitId)
    .order('reading_date', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

/** Records a move-in / manual reading for a unit (not through create_bill). */
export async function recordReading(unitId: number, reading: number, readingDate: string): Promise<void> {
  const { error } = await supabase
    .from('meter_readings')
    .upsert({ unit_id: unitId, reading, reading_date: readingDate }, { onConflict: 'unit_id,reading_date' });
  if (error) throw error;
}
