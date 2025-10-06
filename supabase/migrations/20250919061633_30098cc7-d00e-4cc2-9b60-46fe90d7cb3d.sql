-- Update RLS policies for all tables to require authentication for modifications

-- Drop existing policies for hotels table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.hotels;
DROP POLICY IF EXISTS "Allow anyone to select" ON public.hotels;
DROP POLICY IF EXISTS "Allow public read access" ON public.hotels;
DROP POLICY IF EXISTS "Allow anyone to delete" ON public.hotels;
DROP POLICY IF EXISTS "Allow anyone to insert" ON public.hotels;
DROP POLICY IF EXISTS "Allow anyone to update" ON public.hotels;

-- Create new policies for hotels table
CREATE POLICY "Allow public read access" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to modify" ON public.hotels FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Drop existing policies for rooms table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.rooms;
DROP POLICY IF EXISTS "Allow anyone to select" ON public.rooms;
DROP POLICY IF EXISTS "Allow public read access" ON public.rooms;
DROP POLICY IF EXISTS "Allow anyone to delete" ON public.rooms;
DROP POLICY IF EXISTS "Allow anyone to insert" ON public.rooms;
DROP POLICY IF EXISTS "Allow anyone to update" ON public.rooms;

-- Create new policies for rooms table
CREATE POLICY "Allow public read access" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to modify" ON public.rooms FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Drop existing policies for amenities table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.amenities;
DROP POLICY IF EXISTS "Allow anyone to select" ON public.amenities;
DROP POLICY IF EXISTS "Allow public read access" ON public.amenities;
DROP POLICY IF EXISTS "Allow anyone to delete" ON public.amenities;
DROP POLICY IF EXISTS "Allow anyone to insert" ON public.amenities;
DROP POLICY IF EXISTS "Allow anyone to update" ON public.amenities;

-- Create new policies for amenities table
CREATE POLICY "Allow public read access" ON public.amenities FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to modify" ON public.amenities FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Drop existing policies for attractions table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.attractions;
DROP POLICY IF EXISTS "Allow anyone to select" ON public.attractions;
DROP POLICY IF EXISTS "Allow public read access" ON public.attractions;
DROP POLICY IF EXISTS "Allow anyone to delete" ON public.attractions;
DROP POLICY IF EXISTS "Allow anyone to insert" ON public.attractions;
DROP POLICY IF EXISTS "Allow anyone to update" ON public.attractions;

-- Create new policies for attractions table
CREATE POLICY "Allow public read access" ON public.attractions FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to modify" ON public.attractions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Drop existing policies for testimonials table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.testimonials;
DROP POLICY IF EXISTS "Allow anyone to select" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public read access" ON public.testimonials;
DROP POLICY IF EXISTS "Allow anyone to delete" ON public.testimonials;
DROP POLICY IF EXISTS "Allow anyone to insert" ON public.testimonials;
DROP POLICY IF EXISTS "Allow anyone to update" ON public.testimonials;

-- Create new policies for testimonials table
CREATE POLICY "Allow public read access" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to modify" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Drop existing policies for gallery table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.gallery;
DROP POLICY IF EXISTS "Allow anyone to select" ON public.gallery;
DROP POLICY IF EXISTS "Allow public read access" ON public.gallery;
DROP POLICY IF EXISTS "Allow anyone to delete" ON public.gallery;
DROP POLICY IF EXISTS "Allow anyone to insert" ON public.gallery;
DROP POLICY IF EXISTS "Allow anyone to update" ON public.gallery;

-- Create new policies for gallery table
CREATE POLICY "Allow public read access" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to modify" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Update storage policies for authenticated users only
CREATE POLICY "Authenticated users can upload hotel images" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'hotel-images');

CREATE POLICY "Authenticated users can update hotel images" ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id = 'hotel-images');

CREATE POLICY "Authenticated users can delete hotel images" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'hotel-images');

CREATE POLICY "Authenticated users can upload room images" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'room-images');

CREATE POLICY "Authenticated users can update room images" ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id = 'room-images');

CREATE POLICY "Authenticated users can delete room images" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'room-images');

CREATE POLICY "Authenticated users can upload gallery images" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Authenticated users can update gallery images" ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id = 'gallery-images');

CREATE POLICY "Authenticated users can delete gallery images" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'gallery-images');

-- Allow public read access to all storage buckets
CREATE POLICY "Public can view hotel images" ON storage.objects 
FOR SELECT USING (bucket_id = 'hotel-images');

CREATE POLICY "Public can view room images" ON storage.objects 
FOR SELECT USING (bucket_id = 'room-images');

CREATE POLICY "Public can view gallery images" ON storage.objects 
FOR SELECT USING (bucket_id = 'gallery-images');