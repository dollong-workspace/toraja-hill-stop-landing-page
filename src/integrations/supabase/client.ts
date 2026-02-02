import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock client if credentials are missing to prevent app crashes
const createSupabaseClient = (): SupabaseClient | null => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not configured. Booking tracking will be disabled.');
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

export const supabase = createSupabaseClient();
export const isSupabaseConfigured = !!supabase;

// Types for database
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'refunded';

export interface Room {
  id: string;
  room_number: string;
  name: string;
  description: string | null;
  max_guests: number;
  price_per_night: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_price: number;
  status: BookingStatus;
  notes: string | null;
  payment_status: PaymentStatus;
  payment_method: string | null;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
}
