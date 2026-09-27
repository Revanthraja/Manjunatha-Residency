import { supabase } from '@/src/lib/supabase';
import { Tables, TablesInsert } from '@/src/types/database';

export type Tenant = Tables<'tenants'>;

export async function getTenantByProfile(profileId: string): Promise<Tenant | null> {
  const { data, error } = await supabase.from('tenants').select('*').eq('profile_id', profileId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createTenant(input: TablesInsert<'tenants'>): Promise<Tenant> {
  const { data, error } = await supabase.from('tenants').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function setTenantIdProof(tenantId: number, path: string): Promise<void> {
  const { error } = await supabase.from('tenants').update({ id_proof_path: path }).eq('id', tenantId);
  if (error) throw error;
}
