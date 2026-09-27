import { supabase } from '@/src/lib/supabase';
import { Tables, TablesInsert } from '@/src/types/database';

export type Tenancy = Tables<'tenancies'>;

export type MyTenancy = Tenancy & {
  unit: { id: number; unit_number: string; floor: number; building_id: number; building_name: string };
};

/** The signed-in tenant's current house, or null if they don't have one. */
export async function getMyCurrentTenancy(): Promise<MyTenancy | null> {
  const { data: unitId, error: unitErr } = await supabase.rpc('my_current_unit');
  if (unitErr) throw unitErr;
  if (!unitId) return null;

  const { data, error } = await supabase
    .from('tenancies')
    .select('*, units ( id, unit_number, floor, building_id, buildings ( name ) )')
    .eq('unit_id', unitId)
    .is('end_date', null)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const { units, ...tenancy } = data as any;
  return {
    ...tenancy,
    unit: {
      id: units.id,
      unit_number: units.unit_number,
      floor: units.floor,
      building_id: units.building_id,
      building_name: units.buildings?.name ?? '',
    },
  };
}

export type TenancyWithTenant = Tenancy & { tenant: { id: number; full_name: string; phone: string } };

/** The current (not-yet-ended) tenancy of a specific unit, staff view. */
export async function getCurrentTenancyForUnit(unitId: number): Promise<TenancyWithTenant | null> {
  const { data, error } = await supabase
    .from('tenancies')
    .select('*, tenants ( id, full_name, phone )')
    .eq('unit_id', unitId)
    .is('end_date', null)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { tenants, ...tenancy } = data as any;
  return { ...tenancy, tenant: tenants };
}

export async function createTenancy(input: TablesInsert<'tenancies'>): Promise<Tenancy> {
  const { data, error } = await supabase.from('tenancies').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function endTenancy(tenancyId: number, endDate: string, depositRefund: number): Promise<void> {
  const { error } = await supabase
    .from('tenancies')
    .update({ end_date: endDate, deposit_refund: depositRefund })
    .eq('id', tenancyId);
  if (error) throw error;
}
