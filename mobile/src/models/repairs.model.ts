import { supabase } from '@/src/lib/supabase';
import { Enums, Tables, TablesInsert } from '@/src/types/database';

export type MaintenanceRequest = Tables<'maintenance_requests'>;
export type MaintenanceStatus = Enums<'maintenance_status'>;

export type RepairWithUnit = MaintenanceRequest & {
  unit_number: string;
  building_name: string;
};

/** All repair requests across the given buildings (staff view). */
export async function listRepairs(buildingIds: number[]): Promise<RepairWithUnit[]> {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select('*, units!inner ( unit_number, building_id, buildings!inner ( name ) )')
    .in('units.building_id', buildingIds)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    ...r,
    unit_number: r.units.unit_number,
    building_name: r.units.buildings.name,
  }));
}

/** A tenant's own repair requests, most recent first. */
export async function listMyRepairs(unitId: number, raisedBy: string): Promise<MaintenanceRequest[]> {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select('*')
    .eq('unit_id', unitId)
    .eq('raised_by', raisedBy)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createRepair(input: TablesInsert<'maintenance_requests'>): Promise<MaintenanceRequest> {
  const { data, error } = await supabase.from('maintenance_requests').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateRepairStatus(id: number, status: MaintenanceStatus): Promise<void> {
  const { error } = await supabase
    .from('maintenance_requests')
    .update({ status, resolved_at: status === 'resolved' ? new Date().toISOString() : null })
    .eq('id', id);
  if (error) throw error;
}
