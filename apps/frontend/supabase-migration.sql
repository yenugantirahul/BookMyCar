-- ============================================================
-- BookMyCar: Run this in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles (synced from Clerk) ─────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,           -- Clerk user ID e.g. user_2xyz
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Cars ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT NOT NULL,
  license_plate TEXT NOT NULL UNIQUE,
  price_per_day NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('economy', 'standard', 'premium', 'suv', 'luxury')),
  transmission TEXT NOT NULL CHECK (transmission IN ('manual', 'automatic')),
  seats INTEGER NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
  location TEXT NOT NULL,
  description TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Car Images ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS car_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Bookings ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  price_per_day NUMERIC(10, 2) NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  cancellation_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS cars_category_idx ON cars(category);
CREATE INDEX IF NOT EXISTS cars_location_idx ON cars(location);
CREATE INDEX IF NOT EXISTS cars_is_available_idx ON cars(is_available);
CREATE INDEX IF NOT EXISTS cars_search_idx ON cars(is_available, category, location);
CREATE INDEX IF NOT EXISTS car_images_car_id_idx ON car_images(car_id);
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_car_id_idx ON bookings(car_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Helper: extract Clerk user ID from JWT 'sub' claim
CREATE OR REPLACE FUNCTION public.clerk_user_id()
RETURNS TEXT AS $$
  SELECT NULLIF(auth.jwt() ->> 'sub', '')::TEXT;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper: check if current user is admin
-- (This relies on profiles_select_own so it doesn't need SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = public.clerk_user_id() AND role = 'admin'
  );
$$ LANGUAGE SQL STABLE;

-- ── Profiles RLS ──────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_select" ON profiles;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (public.clerk_user_id() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (public.clerk_user_id() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (public.clerk_user_id() = id);

-- We intentionally DO NOT create a profiles_admin_select policy. 
-- Creating one that queries `profiles` causes infinite recursion!
-- Admins only need to read their own profile in this app.

-- ── Cars RLS ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "cars_public_select" ON cars;
DROP POLICY IF EXISTS "cars_admin_insert" ON cars;
DROP POLICY IF EXISTS "cars_admin_update" ON cars;
DROP POLICY IF EXISTS "cars_admin_delete" ON cars;

CREATE POLICY "cars_public_select" ON cars
  FOR SELECT USING (true);

CREATE POLICY "cars_admin_insert" ON cars
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "cars_admin_update" ON cars
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "cars_admin_delete" ON cars
  FOR DELETE USING (public.is_admin());

-- ── Car Images RLS ────────────────────────────────────────────
DROP POLICY IF EXISTS "car_images_public_select" ON car_images;
DROP POLICY IF EXISTS "car_images_admin_insert" ON car_images;
DROP POLICY IF EXISTS "car_images_admin_update" ON car_images;
DROP POLICY IF EXISTS "car_images_admin_delete" ON car_images;

CREATE POLICY "car_images_public_select" ON car_images
  FOR SELECT USING (true);

CREATE POLICY "car_images_admin_insert" ON car_images
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "car_images_admin_update" ON car_images
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "car_images_admin_delete" ON car_images
  FOR DELETE USING (public.is_admin());

-- ── Bookings RLS ──────────────────────────────────────────────
DROP POLICY IF EXISTS "bookings_select_own" ON bookings;
DROP POLICY IF EXISTS "bookings_insert_own" ON bookings;
DROP POLICY IF EXISTS "bookings_update_own" ON bookings;
DROP POLICY IF EXISTS "bookings_admin_select" ON bookings;
DROP POLICY IF EXISTS "bookings_admin_update" ON bookings;

CREATE POLICY "bookings_select_own" ON bookings
  FOR SELECT USING (public.clerk_user_id() = user_id);

CREATE POLICY "bookings_insert_own" ON bookings
  FOR INSERT WITH CHECK (public.clerk_user_id() = user_id);

CREATE POLICY "bookings_update_own" ON bookings
  FOR UPDATE USING (public.clerk_user_id() = user_id);

CREATE POLICY "bookings_admin_select" ON bookings
  FOR SELECT USING (public.is_admin());

CREATE POLICY "bookings_admin_update" ON bookings
  FOR UPDATE USING (public.is_admin());

-- ============================================================
-- STORAGE BUCKET (run separately if not already created)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('car-images', 'car-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- AFTER SIGN-IN: Promote yourself to admin
-- Find your Clerk user ID in Clerk Dashboard → Users
-- ============================================================
-- UPDATE profiles SET role = 'admin' WHERE id = 'user_YOUR_CLERK_ID';
