import { supabase } from '@/src/lib/supabase';
import { Tables, TablesInsert } from '@/src/types/database';

export type Application = Tables<'applications'>;

export async function createApplication(input: TablesInsert<'applications'>): Promise<Application> {
  const { data, error } = await supabase.from('applications').insert(input).select().single();
  if (error) throw error;
  return data;
}

/** Pending applications for a house — staff use this to prefill a move-in. */
export async function listApplicationsForUnit(unitId: number): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('unit_id', unitId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function setApplicationStatus(id: number, status: Application['status']): Promise<void> {
  const { error } = await supabase.from('applications').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function listMyApplications(profileId: string): Promise<(Application & { unit_number: string; building_name: string })[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*, units ( unit_number, buildings ( name ) )')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((a: any) => ({
    ...a,
    unit_number: a.units?.unit_number ?? '',
    building_name: a.units?.buildings?.name ?? '',
  }));
}
