-- Drop all existing policies for all tables
DROP POLICY IF EXISTS "Update" ON public.amenities;
DROP POLICY IF EXISTS "Delete" ON public.attractions;
DROP POLICY IF EXISTS "Insert" ON public.attractions;
DROP POLICY IF EXISTS "Public read access for attractions" ON public.attractions;
DROP POLICY IF EXISTS "Update" ON public.attractions;
DROP POLICY IF EXISTS "Delete" ON public.gallery;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.gallery;
DROP POLICY IF EXISTS "Public read access for gallery" ON public.gallery;
DROP POLICY IF EXISTS "Update" ON public.gallery;
DROP POLICY IF EXISTS "Delete" ON public.hotels;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.hotels;
DROP POLICY IF EXISTS "Public read access for hotels" ON public.hotels;
DROP POLICY IF EXISTS "Update" ON public.hotels;
DROP POLICY IF EXISTS "Delete" ON public.rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.rooms;
DROP POLICY IF EXISTS "Public read access for rooms" ON public.rooms;
DROP POLICY IF EXISTS "Update" ON public.rooms;
DROP POLICY IF EXISTS "Delete" ON public.testimonials;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.testimonials;
DROP POLICY IF EXISTS "Public read access for testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Update" ON public.testimonials;

-- Create new policies for amenities table
CREATE POLICY "Allow all operations for authenticated users" ON public.amenities FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anyone to delete" ON public.amenities FOR DELETE TO public USING (true);
CREATE POLICY "Allow anyone to insert" ON public.amenities FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow anyone to select" ON public.amenities FOR SELECT TO public USING (true);
CREATE POLICY "Allow anyone to update" ON public.amenities FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.amenities FOR SELECT TO anon USING (true);

-- Create new policies for attractions table
CREATE POLICY "Allow all operations for authenticated users" ON public.attractions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anyone to delete" ON public.attractions FOR DELETE TO public USING (true);
CREATE POLICY "Allow anyone to insert" ON public.attractions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow anyone to select" ON public.attractions FOR SELECT TO public USING (true);
CREATE POLICY "Allow anyone to update" ON public.attractions FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.attractions FOR SELECT TO anon USING (true);

-- Create new policies for gallery table
CREATE POLICY "Allow all operations for authenticated users" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anyone to delete" ON public.gallery FOR DELETE TO public USING (true);
CREATE POLICY "Allow anyone to insert" ON public.gallery FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow anyone to select" ON public.gallery FOR SELECT TO public USING (true);
CREATE POLICY "Allow anyone to update" ON public.gallery FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.gallery FOR SELECT TO anon USING (true);

-- Create new policies for hotels table
CREATE POLICY "Allow all operations for authenticated users" ON public.hotels FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anyone to delete" ON public.hotels FOR DELETE TO public USING (true);
CREATE POLICY "Allow anyone to insert" ON public.hotels FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow anyone to select" ON public.hotels FOR SELECT TO public USING (true);
CREATE POLICY "Allow anyone to update" ON public.hotels FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.hotels FOR SELECT TO anon USING (true);

-- Create new policies for rooms table
CREATE POLICY "Allow all operations for authenticated users" ON public.rooms FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anyone to delete" ON public.rooms FOR DELETE TO public USING (true);
CREATE POLICY "Allow anyone to insert" ON public.rooms FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow anyone to select" ON public.rooms FOR SELECT TO public USING (true);
CREATE POLICY "Allow anyone to update" ON public.rooms FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.rooms FOR SELECT TO anon USING (true);

-- Create new policies for testimonials table
CREATE POLICY "Allow all operations for authenticated users" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anyone to delete" ON public.testimonials FOR DELETE TO public USING (true);
CREATE POLICY "Allow anyone to insert" ON public.testimonials FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow anyone to select" ON public.testimonials FOR SELECT TO public USING (true);
CREATE POLICY "Allow anyone to update" ON public.testimonials FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.testimonials FOR SELECT TO anon USING (true);