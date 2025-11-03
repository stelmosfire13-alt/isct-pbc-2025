-- Storage RLS Policies for pet-images bucket

-- Policy: Users can upload images to their own folder
CREATE POLICY "Users can upload own pet images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pet-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Public can view all pet images (for displaying uploaded images)
CREATE POLICY "Public can view pet images"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'pet-images'
);

-- Policy: Users can delete their own pet images
CREATE POLICY "Users can delete own pet images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'pet-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
