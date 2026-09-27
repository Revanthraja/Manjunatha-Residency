import { supabase } from '@/src/lib/supabase';
import { Tables, TablesInsert } from '@/src/types/database';

export type Expense = Tables<'expenses'>;

export async function listExpenses(buildingId: number, monthStart: string, monthEnd: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('building_id', buildingId)
    .gte('spent_on', monthStart)
    .lt('spent_on', monthEnd)
    .order('spent_on', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createExpense(input: TablesInsert<'expenses'>): Promise<Expense> {
  const { data, error } = await supabase.from('expenses').insert(input).select().single();
  if (error) throw error;
  return data;
}
