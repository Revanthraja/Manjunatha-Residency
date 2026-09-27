// Generated from the Supabase project (bsjzvstnbdtnpbanbsan) schema.
// Regenerate after any migration: see mobile/README.md.
/* eslint-disable @typescript-eslint/no-empty-object-type */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string;
          full_name: string;
          id: number;
          message: string | null;
          move_in_date: string | null;
          phone: string;
          profile_id: string;
          status: Database['public']['Enums']['application_status'];
          unit_id: number;
        };
        Insert: {
          created_at?: string;
          full_name: string;
          id?: never;
          message?: string | null;
          move_in_date?: string | null;
          phone: string;
          profile_id?: string;
          status?: Database['public']['Enums']['application_status'];
          unit_id: number;
        };
        Update: {
          created_at?: string;
          full_name?: string;
          id?: never;
          message?: string | null;
          move_in_date?: string | null;
          phone?: string;
          profile_id?: string;
          status?: Database['public']['Enums']['application_status'];
          unit_id?: number;
        };
        Relationships: [
          { foreignKeyName: 'applications_profile_id_fkey'; columns: ['profile_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'applications_unit_id_fkey'; columns: ['unit_id']; isOneToOne: false; referencedRelation: 'units'; referencedColumns: ['id'] },
        ];
      };
      bills: {
        Row: {
          created_at: string;
          due_date: string;
          electricity: number;
          id: number;
          month: string;
          note: string | null;
          other: number;
          rent: number;
          tenancy_id: number;
          total: number | null;
        };
        Insert: {
          created_at?: string;
          due_date: string;
          electricity?: number;
          id?: never;
          month: string;
          note?: string | null;
          other?: number;
          rent: number;
          tenancy_id: number;
          total?: number | null;
        };
        Update: {
          created_at?: string;
          due_date?: string;
          electricity?: number;
          id?: never;
          month?: string;
          note?: string | null;
          other?: number;
          rent?: number;
          tenancy_id?: number;
          total?: number | null;
        };
        Relationships: [
          { foreignKeyName: 'bills_tenancy_id_fkey'; columns: ['tenancy_id']; isOneToOne: false; referencedRelation: 'tenancies'; referencedColumns: ['id'] },
        ];
      };
      buildings: {
        Row: {
          address: string;
          created_at: string;
          electricity_rate: number;
          id: number;
          manager_id: string | null;
          name: string;
        };
        Insert: {
          address: string;
          created_at?: string;
          electricity_rate?: number;
          id?: never;
          manager_id?: string | null;
          name: string;
        };
        Update: {
          address?: string;
          created_at?: string;
          electricity_rate?: number;
          id?: never;
          manager_id?: string | null;
          name?: string;
        };
        Relationships: [
          { foreignKeyName: 'buildings_manager_id_fkey'; columns: ['manager_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
        ];
      };
      expenses: {
        Row: {
          amount: number;
          building_id: number;
          category: string;
          created_at: string;
          id: number;
          note: string | null;
          spent_on: string;
        };
        Insert: {
          amount: number;
          building_id: number;
          category: string;
          created_at?: string;
          id?: never;
          note?: string | null;
          spent_on?: string;
        };
        Update: {
          amount?: number;
          building_id?: number;
          category?: string;
          created_at?: string;
          id?: never;
          note?: string | null;
          spent_on?: string;
        };
        Relationships: [
          { foreignKeyName: 'expenses_building_id_fkey'; columns: ['building_id']; isOneToOne: false; referencedRelation: 'buildings'; referencedColumns: ['id'] },
        ];
      };
      maintenance_requests: {
        Row: {
          created_at: string;
          description: string;
          id: number;
          photo_path: string | null;
          raised_by: string | null;
          resolved_at: string | null;
          status: Database['public']['Enums']['maintenance_status'];
          unit_id: number;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: never;
          photo_path?: string | null;
          raised_by?: string | null;
          resolved_at?: string | null;
          status?: Database['public']['Enums']['maintenance_status'];
          unit_id: number;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: never;
          photo_path?: string | null;
          raised_by?: string | null;
          resolved_at?: string | null;
          status?: Database['public']['Enums']['maintenance_status'];
          unit_id?: number;
        };
        Relationships: [
          { foreignKeyName: 'maintenance_requests_raised_by_fkey'; columns: ['raised_by']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'maintenance_requests_unit_id_fkey'; columns: ['unit_id']; isOneToOne: false; referencedRelation: 'units'; referencedColumns: ['id'] },
        ];
      };
      meter_readings: {
        Row: {
          created_at: string;
          id: number;
          reading: number;
          reading_date: string;
          unit_id: number;
        };
        Insert: {
          created_at?: string;
          id?: never;
          reading: number;
          reading_date?: string;
          unit_id: number;
        };
        Update: {
          created_at?: string;
          id?: never;
          reading?: number;
          reading_date?: string;
          unit_id?: number;
        };
        Relationships: [
          { foreignKeyName: 'meter_readings_unit_id_fkey'; columns: ['unit_id']; isOneToOne: false; referencedRelation: 'units'; referencedColumns: ['id'] },
        ];
      };
      payments: {
        Row: {
          amount: number;
          bill_id: number;
          created_at: string;
          id: number;
          method: Database['public']['Enums']['payment_method'];
          paid_on: string;
          received_by: string | null;
          reference: string | null;
        };
        Insert: {
          amount: number;
          bill_id: number;
          created_at?: string;
          id?: never;
          method: Database['public']['Enums']['payment_method'];
          paid_on?: string;
          received_by?: string | null;
          reference?: string | null;
        };
        Update: {
          amount?: number;
          bill_id?: number;
          created_at?: string;
          id?: never;
          method?: Database['public']['Enums']['payment_method'];
          paid_on?: string;
          received_by?: string | null;
          reference?: string | null;
        };
        Relationships: [
          { foreignKeyName: 'payments_bill_id_fkey'; columns: ['bill_id']; isOneToOne: false; referencedRelation: 'bill_summary'; referencedColumns: ['bill_id'] },
          { foreignKeyName: 'payments_bill_id_fkey'; columns: ['bill_id']; isOneToOne: false; referencedRelation: 'bills'; referencedColumns: ['id'] },
          { foreignKeyName: 'payments_received_by_fkey'; columns: ['received_by']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string;
          id: string;
          phone: string | null;
          role: Database['public']['Enums']['user_role'];
        };
        Insert: {
          created_at?: string;
          full_name: string;
          id: string;
          phone?: string | null;
          role?: Database['public']['Enums']['user_role'];
        };
        Update: {
          created_at?: string;
          full_name?: string;
          id?: string;
          phone?: string | null;
          role?: Database['public']['Enums']['user_role'];
        };
        Relationships: [];
      };
      tenancies: {
        Row: {
          created_at: string;
          deposit: number;
          deposit_refund: number | null;
          end_date: string | null;
          id: number;
          rent: number;
          start_date: string;
          tenant_id: number;
          unit_id: number;
        };
        Insert: {
          created_at?: string;
          deposit?: number;
          deposit_refund?: number | null;
          end_date?: string | null;
          id?: never;
          rent: number;
          start_date: string;
          tenant_id: number;
          unit_id: number;
        };
        Update: {
          created_at?: string;
          deposit?: number;
          deposit_refund?: number | null;
          end_date?: string | null;
          id?: never;
          rent?: number;
          start_date?: string;
          tenant_id?: number;
          unit_id?: number;
        };
        Relationships: [
          { foreignKeyName: 'tenancies_tenant_id_fkey'; columns: ['tenant_id']; isOneToOne: false; referencedRelation: 'tenants'; referencedColumns: ['id'] },
          { foreignKeyName: 'tenancies_unit_id_fkey'; columns: ['unit_id']; isOneToOne: false; referencedRelation: 'units'; referencedColumns: ['id'] },
        ];
      };
      tenants: {
        Row: {
          created_at: string;
          full_name: string;
          id: number;
          id_proof_path: string | null;
          permanent_address: string | null;
          phone: string;
          profile_id: string | null;
        };
        Insert: {
          created_at?: string;
          full_name: string;
          id?: never;
          id_proof_path?: string | null;
          permanent_address?: string | null;
          phone: string;
          profile_id?: string | null;
        };
        Update: {
          created_at?: string;
          full_name?: string;
          id?: never;
          id_proof_path?: string | null;
          permanent_address?: string | null;
          phone?: string;
          profile_id?: string | null;
        };
        Relationships: [
          { foreignKeyName: 'tenants_profile_id_fkey'; columns: ['profile_id']; isOneToOne: true; referencedRelation: 'profiles'; referencedColumns: ['id'] },
        ];
      };
      units: {
        Row: {
          building_id: number;
          created_at: string;
          floor: number;
          id: number;
          rent: number;
          unit_number: string;
        };
        Insert: {
          building_id: number;
          created_at?: string;
          floor?: number;
          id?: never;
          rent: number;
          unit_number: string;
        };
        Update: {
          building_id?: number;
          created_at?: string;
          floor?: number;
          id?: never;
          rent?: number;
          unit_number?: string;
        };
        Relationships: [
          { foreignKeyName: 'units_building_id_fkey'; columns: ['building_id']; isOneToOne: false; referencedRelation: 'buildings'; referencedColumns: ['id'] },
        ];
      };
    };
    Views: {
      bill_summary: {
        Row: {
          balance: number | null;
          bill_id: number | null;
          due_date: string | null;
          month: string | null;
          paid: number | null;
          status: string | null;
          tenancy_id: number | null;
          total: number | null;
        };
        Relationships: [
          { foreignKeyName: 'bills_tenancy_id_fkey'; columns: ['tenancy_id']; isOneToOne: false; referencedRelation: 'tenancies'; referencedColumns: ['id'] },
        ];
      };
    };
    Functions: {
      create_bill: {
        Args: {
          p_meter_reading?: number;
          p_month: string;
          p_note?: string;
          p_other?: number;
          p_tenancy_id: number;
        };
        Returns: Database['public']['Tables']['bills']['Row'];
      };
      is_my_tenancy: { Args: { p_tenancy_id: number }; Returns: boolean };
      is_owner: { Args: Record<string, never>; Returns: boolean };
      is_staff: { Args: Record<string, never>; Returns: boolean };
      manages_building: { Args: { p_building_id: number }; Returns: boolean };
      manages_tenancy: { Args: { p_tenancy_id: number }; Returns: boolean };
      manages_unit: { Args: { p_unit_id: number }; Returns: boolean };
      my_current_unit: { Args: Record<string, never>; Returns: number };
      my_role: { Args: Record<string, never>; Returns: Database['public']['Enums']['user_role'] };
      vacant_units: {
        Args: Record<string, never>;
        Returns: { building: string; rent: number; unit_id: number; unit_number: string; floor: number }[];
      };
    };
    Enums: {
      application_status: 'pending' | 'approved' | 'rejected';
      maintenance_status: 'open' | 'in_progress' | 'resolved';
      payment_method: 'cash' | 'upi' | 'bank_transfer' | 'cheque';
      user_role: 'owner' | 'manager' | 'tenant';
    };
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database['public'];

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];
export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update'];
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T];
export type BillSummaryRow = PublicSchema['Views']['bill_summary']['Row'];
