import { supabase } from '@/src/lib/supabase';

export type MonthBillRow = {
  bill_id: number;
  tenancy_id: number;
  unit_id: number;
  unit_number: string;
  building_id: number;
  tenant_name: string;
  tenant_phone: string;
  total: number;
  paid: number;
  balance: number;
  status: string;
  due_date: string;
};

/** This month's bills for every occupied house in the given buildings. */
export async function listMonthBills(buildingIds: number[], month: string): Promise<MonthBillRow[]> {
  if (buildingIds.length === 0) return [];
  const { data, error } = await supabase
    .from('bills')
    .select(
      `id, total, due_date,
       bill_summary ( paid, balance, status ),
       tenancies!inner (
         id, unit_id,
         units!inner ( id, unit_number, building_id ),
         tenants ( full_name, phone )
       )`
    )
    .eq('month', month)
    .in('tenancies.units.building_id', buildingIds);
  if (error) throw error;

  return (data ?? []).map((b: any) => ({
    bill_id: b.id,
    tenancy_id: b.tenancies.id,
    unit_id: b.tenancies.units.id,
    unit_number: b.tenancies.units.unit_number,
    building_id: b.tenancies.units.building_id,
    tenant_name: b.tenancies.tenants?.full_name ?? '',
    tenant_phone: b.tenancies.tenants?.phone ?? '',
    total: b.total ?? 0,
    paid: b.bill_summary?.paid ?? b.bill_summary?.[0]?.paid ?? 0,
    balance: b.bill_summary?.balance ?? b.bill_summary?.[0]?.balance ?? b.total ?? 0,
    status: b.bill_summary?.status ?? b.bill_summary?.[0]?.status ?? 'unpaid',
    due_date: b.due_date,
  }));
}

/** Count of houses with no current tenancy, across the given buildings. */
export async function countVacantUnits(buildingIds: number[]): Promise<number> {
  if (buildingIds.length === 0) return 0;
  const { data, error } = await supabase
    .from('units')
    .select('id, tenancies ( id, end_date )')
    .in('building_id', buildingIds);
  if (error) throw error;
  return (data ?? []).filter(
    (u: any) => !(u.tenancies ?? []).some((t: any) => t.end_date === null || new Date(t.end_date) >= new Date())
  ).length;
}

/** Count of open + in-progress repair requests across the given buildings. */
export async function countOpenRepairs(buildingIds: number[]): Promise<number> {
  if (buildingIds.length === 0) return 0;
  const { count, error } = await supabase
    .from('maintenance_requests')
    .select('id, units!inner ( building_id )', { count: 'exact', head: true })
    .in('units.building_id', buildingIds)
    .in('status', ['open', 'in_progress']);
  if (error) throw error;
  return count ?? 0;
}
