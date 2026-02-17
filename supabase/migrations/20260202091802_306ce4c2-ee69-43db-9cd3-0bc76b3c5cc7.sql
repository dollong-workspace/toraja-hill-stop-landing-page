-- Tighten bookings RLS: allow public INSERT but avoid permissive (true) policy and disallow public reads
DROP POLICY IF EXISTS "Public can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can submit bookings" ON public.bookings;

CREATE POLICY "Anyone can submit bookings"
ON public.bookings
FOR INSERT
WITH CHECK (
  guest_name <> ''
  AND guest_phone <> ''
  AND check_out_date > check_in_date
  AND number_of_guests > 0
  AND number_of_rooms > 0
);