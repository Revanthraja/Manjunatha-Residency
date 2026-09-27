import { supabase } from '@/src/lib/supabase';
import { Tables } from '@/src/types/database';

export type Unit = Tables<'units'>;
export type VacantUnit = { unit_id: number; building: string; unit_number: string; floor: number; rent: number };

export type UnitWithCurrentTenancy = Unit & {
  building_name: string;
  current_tenancy: {
    id: number;
    rent: number;
    start_date: string;
    tenant: { id: number; full_name: string; phone: string };
    latest_bill_status: string | null;
  } | null;
};

/** Every house in a building, each with its current tenant (if any) and their latest bill status. */
export async function listUnitsForBuilding(buildingId: number): Promise<UnitWithCurrentTenancy[]> {
  const { data, error } = await supabase
    .from('units')
    .select(
      `id, building_id, unit_number, floor, rent, created_at,
       buildings ( name ),
       tenancies (
         id, rent, start_date, end_date,
         tenants ( id, full_name, phone ),
         bills ( id, month, bill_summary ( status ) )
       )`
    )
    .eq('building_id', buildingId)
    .order('floor')
    .order('unit_number');
  if (error) throw error;

  return (data ?? []).map((u: any) => {
    const current = (u.tenancies ?? []).find(
      (t: any) => t.end_date === null || new Date(t.end_date) >= new Date()
    );
    let latestBillStatus: string | null = null;
    if (current) {
      const bills = [...(current.bills ?? [])].sort((a: any, b: any) => (a.month < b.month ? 1 : -1));
      latestBillStatus = bills[0]?.bill_summary?.[0]?.status ?? bills[0]?.bill_summary?.status ?? null;
    }
    return {
      id: u.id,
      building_id: u.building_id,
      unit_number: u.unit_number,
      floor: u.floor,
      rent: u.rent,
      created_at: u.created_at,
      building_name: u.buildings?.name ?? '',
      current_tenancy: current
        ? {
            id: current.id,
            rent: current.rent,
            start_date: current.start_date,
            tenant: { id: current.tenants.id, full_name: current.tenants.full_name, phone: current.tenants.phone },
            latest_bill_status: latestBillStatus,
          }
        : null,
    };
  });
}

export async function getUnit(unitId: number): Promise<(Unit & { building: { name: string; electricity_rate: number } }) | null> {
  const { data, error } = await supabase
    .from('units')
    .select('*, buildings ( name, electricity_rate )')
    .eq('id', unitId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { buildings, ...unit } = data as any;
  return { ...unit, building: buildings };
}

/** Houses with no current tenancy — visible to signed-in applicants. */
export async function listVacantUnits(): Promise<VacantUnit[]> {
  const { data, error } = await supabase.rpc('vacant_units');
  if (error) throw error;
  return data ?? [];
}
