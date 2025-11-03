-- Enable Row Level Security on pets table
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own pets
CREATE POLICY "Users can view own pets"
ON pets FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can create their own pets
CREATE POLICY "Users can create own pets"
ON pets FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own pets
CREATE POLICY "Users can update own pets"
ON pets FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own pets
CREATE POLICY "Users can delete own pets"
ON pets FOR DELETE
TO authenticated
USING (user_id = auth.uid());
