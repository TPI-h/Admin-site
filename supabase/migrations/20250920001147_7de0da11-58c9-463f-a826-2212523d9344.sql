-- Update hotels table to support multiple images instead of single image
ALTER TABLE public.hotels 
ADD COLUMN images TEXT[] DEFAULT '{}';

-- Copy existing image_url to images array if it exists
UPDATE public.hotels 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';

-- Remove the old image_url column
ALTER TABLE public.hotels 
DROP COLUMN image_url;

-- Update rooms table to support multiple images
ALTER TABLE public.rooms 
ADD COLUMN images TEXT[] DEFAULT '{}';

-- Copy existing image_url to images array if it exists
UPDATE public.rooms 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';

-- Remove the old image_url column from rooms
ALTER TABLE public.rooms 
DROP COLUMN image_url;