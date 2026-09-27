import { supabase } from '@/src/lib/supabase';
import { BillSummaryRow, Tables } from '@/src/types/database';

export type Bill = Tables<'bills'>;
export type BillWithSummary = Bill & { summary: BillSummaryRow | null };

export async function listBillsForTenancy(tenancyId: number): Promise<BillWithSummary[]> {
  const { data, error } = await supabase
    .from('bills')
    .select('*, bill_summary ( * )')
    .eq('tenancy_id', tenancyId)
    .order('month', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((b: any) => ({ ...b, summary: b.bill_summary ?? null }));
}

export async function getBill(billId: number): Promise<BillWithSummary | null> {
  const { data, error } = await supabase.from('bills').select('*, bill_summary ( * )').eq('id', billId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { bill_summary, ...bill } = data as any;
  return { ...bill, summary: bill_summary ?? null };
}

export type BillWithContext = BillWithSummary & {
  tenancy_id: number;
  unit_number: string;
  building_name: string;
  tenant_name: string;
  tenant_phone: string;
  /** electricity ÷ the building's ₹-per-unit rate, rounded — for display only. */
  electricityUnits: number;
};

/** A bill plus who it belongs to — for the record-payment and receipt screens. */
export async function getBillWithContext(billId: number): Promise<BillWithContext | null> {
  const { data, error } = await supabase
    .from('bills')
    .select(
      `*, bill_summary ( * ),
       tenancies (
         id, units ( unit_number, buildings ( name, electricity_rate ) ),
         tenants ( full_name, phone )
       )`
    )
    .eq('id', billId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { bill_summary, tenancies, ...bill } = data as any;
  const rate = tenancies.units.buildings.electricity_rate;
  return {
    ...bill,
    summary: bill_summary ?? null,
    tenancy_id: tenancies.id,
    unit_number: tenancies.units.unit_number,
    building_name: tenancies.units.buildings.name,
    tenant_name: tenancies.tenants?.full_name ?? '',
    tenant_phone: tenancies.tenants?.phone ?? '',
    electricityUnits: rate > 0 ? Math.round(bill.electricity / rate) : 0,
  };
}

/** Runs the `create_bill` function: records the meter reading (if given) and
 * makes a bill with rent + electricity (reading delta × the building's rate) + other. */
export async function createBill(args: {
  tenancyId: number;
  month: string;
  meterReading?: number;
  other?: number;
  note?: string;
}): Promise<Bill> {
  const { data, error } = await supabase.rpc('create_bill', {
    p_tenancy_id: args.tenancyId,
    p_month: args.month,
    p_meter_reading: args.meterReading,
    p_other: args.other ?? 0,
    p_note: args.note,
  });
  if (error) throw error;
  return data as Bill;
}
