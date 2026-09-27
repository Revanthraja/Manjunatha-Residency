import { supabase } from '@/src/lib/supabase';
import { Enums, Tables, TablesInsert } from '@/src/types/database';

export type Payment = Tables<'payments'>;

export async function listPaymentsForBill(billId: number): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('bill_id', billId)
    .order('paid_on', { ascending: false });
  if (error) throw error;
  return data;
}

export type ReceiptData = Payment & {
  bill_month: string;
  bill_total: number;
  balance_after: number;
  unit_number: string;
  building_name: string;
  building_address: string;
  tenant_name: string;
  received_by_name: string | null;
};

/** Everything the receipt screen needs, for a single payment. */
export async function getReceipt(paymentId: number): Promise<ReceiptData | null> {
  const { data, error } = await supabase
    .from('payments')
    .select(
      `*, bills ( month, total, bill_summary ( balance ),
         tenancies ( units ( unit_number, buildings ( name, address ) ), tenants ( full_name ) ) ),
       profiles ( full_name )`
    )
    .eq('id', paymentId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { bills, profiles, ...payment } = data as any;
  return {
    ...payment,
    bill_month: bills.month,
    bill_total: bills.total,
    balance_after: bills.bill_summary?.balance ?? bills.bill_summary?.[0]?.balance ?? 0,
    unit_number: bills.tenancies.units.unit_number,
    building_name: bills.tenancies.units.buildings.name,
    building_address: bills.tenancies.units.buildings.address,
    tenant_name: bills.tenancies.tenants?.full_name ?? '',
    received_by_name: profiles?.full_name ?? null,
  };
}

export async function recordPayment(input: {
  billId: number;
  amount: number;
  method: Enums<'payment_method'>;
  paidOn: string;
  reference?: string;
}): Promise<Payment> {
  const insert: TablesInsert<'payments'> = {
    bill_id: input.billId,
    amount: input.amount,
    method: input.method,
    paid_on: input.paidOn,
    reference: input.reference || null,
  };
  const { data, error } = await supabase.from('payments').insert(insert).select().single();
  if (error) throw error;
  return data;
}
