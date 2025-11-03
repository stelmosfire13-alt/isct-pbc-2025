# Supabase Setup Guide for Pet Management Application

This guide will walk you through setting up your Supabase project for the Pet Management CRUD application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- The project code from Phase 1 and Phase 2 completed

## Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Navigate to [app.supabase.com](https://app.supabase.com)
   - Click "New Project"

2. **Configure Project Settings**
   - **Organization**: Select or create an organization
   - **Name**: `pet-management` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

3. **Wait for Project Creation**
   - This takes 1-2 minutes
   - The dashboard will show "Setting up project..."

## Step 2: Enable Email/Password Authentication

1. **Navigate to Authentication Settings**
   - In the left sidebar, click **Authentication**
   - Click **Providers** tab

2. **Enable Email Provider**
   - Find "Email" in the providers list
   - Toggle it **ON** (it should be enabled by default)
   - Ensure these settings:
     - ✅ **Enable Email provider**: ON
     - ✅ **Confirm email**: OFF (for development)
     - ✅ **Secure email change**: ON
     - ✅ **Secure password change**: ON

3. **Configure Email Templates (Optional)**
   - Click **Email Templates** tab
   - Customize confirmation and reset password emails if desired

## Step 3: Create Storage Bucket for Pet Images

1. **Navigate to Storage**
   - In the left sidebar, click **Storage**
   - Click **Create a new bucket**

2. **Configure Bucket Settings**
   - **Name**: `pet-images`
   - **Public bucket**: ❌ **UNCHECK** (must be private)
   - **File size limit**: `20971520` (20MB in bytes)
   - **Allowed MIME types**:
     ```
     image/jpeg
     image/png
     ```

3. **Click "Create bucket"**

## Step 4: Get Environment Variables

1. **Navigate to Project Settings**
   - Click the ⚙️ **Settings** icon (gear icon) in the sidebar
   - Click **API** in the submenu

2. **Copy the Following Values**

   **Project URL** (found in "Project URL" section):
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **API Keys** (found in "Project API keys" section):
   - **anon** / **public** key (this is safe to expose in the browser)
   - Copy the full key starting with `eyJ...`

3. **Get Service Role Key** (⚠️ Keep this secret!)
   - In the same **API** settings page
   - Find "service_role" key
   - Click "Reveal" and copy it
   - ⚠️ **NEVER** commit this to git or expose in client code

4. **Get Database Connection Strings**
   - Click **Database** in the Settings submenu
   - Scroll to "Connection string" section
   - Copy both:
     - **URI (Session pooler)** - for `DATABASE_URL`
     - **URI (Direct connection)** - for `DIRECT_URL`
   - Replace `[YOUR-PASSWORD]` with your database password from Step 1

## Step 5: Configure Local Environment

1. **Create `.env.local` file**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** with your values:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjU0NjQwMCwiZXhwIjoxOTM4MTIyNDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2MjI1NDY0MDAsImV4cCI6MTkzODEyMjQwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

   # Database URLs for Prisma
   DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

   # Application
   NODE_ENV=development
   ```

3. **Verify `.env.local` is in `.gitignore`**
   ```bash
   grep ".env.local" .gitignore
   # Should return: .env.local
   ```

## Step 6: Initialize Database with Prisma

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Create Database Migration**
   ```bash
   npx prisma migrate dev --name init
   ```

   This will:
   - Create the `pets` table in your Supabase database
   - Apply all indexes and constraints
   - Generate migration files

3. **Verify Table Creation**
   - Go to Supabase Dashboard → **Database** → **Tables**
   - You should see a `pets` table with these columns:
     - `id` (uuid, primary key)
     - `user_id` (uuid)
     - `name` (varchar)
     - `category` (varchar)
     - `birthday` (date)
     - `gender` (varchar)
     - `image_path` (text, nullable)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)

## Step 7: Enable Row Level Security (RLS)

1. **Navigate to SQL Editor**
   - In Supabase Dashboard, click **SQL Editor** in the sidebar
   - Click **New query**

2. **Run RLS Policies for Pets Table**
   ```sql
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
   ```

3. **Click "Run"** (or press Ctrl/Cmd + Enter)

4. **Verify RLS Policies**
   - Go to **Database** → **Tables** → `pets`
   - Click the "Policies" tab
   - You should see 4 policies listed

## Step 8: Configure Storage RLS Policies

1. **In SQL Editor, create a new query**

2. **Run Storage RLS Policies**
   ```sql
   -- Storage RLS Policies for pet-images bucket

   -- Policy: Users can upload images to their own folder
   CREATE POLICY "Users can upload own pet images"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'pet-images' AND
     (storage.foldername(name))[1] = auth.uid()::text
   );

   -- Policy: Users can view their own pet images
   CREATE POLICY "Users can view own pet images"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (
     bucket_id = 'pet-images' AND
     (storage.foldername(name))[1] = auth.uid()::text
   );

   -- Policy: Users can delete their own pet images
   CREATE POLICY "Users can delete own pet images"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (
     bucket_id = 'pet-images' AND
     (storage.foldername(name))[1] = auth.uid()::text
   );
   ```

3. **Click "Run"**

4. **Verify Storage Policies**
   - Go to **Storage** → **Policies**
   - Select `pet-images` bucket
   - You should see 3 policies (INSERT, SELECT, DELETE)

## Step 9: Test Database Connection

1. **Open Prisma Studio**
   ```bash
   npx prisma studio
   ```

2. **Verify Connection**
   - Browser should open to `http://localhost:5555`
   - You should see the `Pet` model listed
   - No data yet (that's expected)

3. **Close Prisma Studio** (Ctrl+C in terminal)

## Step 10: Create Test User (Optional)

To test the application, you'll need a user account:

1. **Option A: Via Supabase Dashboard**
   - Go to **Authentication** → **Users**
   - Click "Add user" → "Create new user"
   - Enter email and password
   - Click "Create user"

2. **Option B: Via Application** (after Phase 3 is implemented)
   - Use the registration form in the app
   - Register with email/password

## Verification Checklist

Before continuing to Phase 3, verify:

- [ ] ✅ Supabase project created and accessible
- [ ] ✅ Email/password authentication enabled
- [ ] ✅ `pet-images` storage bucket created (private, 20MB limit)
- [ ] ✅ Environment variables copied to `.env.local`
- [ ] ✅ Prisma migration ran successfully
- [ ] ✅ `pets` table exists in database
- [ ] ✅ RLS policies enabled on `pets` table (4 policies)
- [ ] ✅ Storage RLS policies enabled on `pet-images` bucket (3 policies)
- [ ] ✅ Prisma Studio connects successfully
- [ ] ✅ Test user created (optional, can be done later)

## Troubleshooting

### Issue: "Migration failed with error: relation already exists"

**Solution**: The table was already created. You can either:
1. Reset the database: `npx prisma migrate reset`
2. Or continue without resetting (table is already there)

### Issue: "Can't reach database server"

**Solution**: Check these:
1. Verify `DATABASE_URL` in `.env.local` is correct
2. Ensure you replaced `[YOUR-PASSWORD]` with actual password
3. Check Supabase project is running (not paused)
4. Verify your IP isn't blocked (Supabase should allow all IPs by default)

### Issue: RLS policies fail to create

**Solution**:
1. Check if policies already exist: Go to Database → Tables → pets → Policies
2. If they exist, you can skip this step
3. If different policies exist, drop them first:
   ```sql
   DROP POLICY IF EXISTS "policy_name" ON pets;
   ```

### Issue: Storage bucket not found

**Solution**:
1. Verify bucket name is exactly `pet-images` (case-sensitive)
2. Check bucket was created: Storage → All buckets
3. Ensure bucket is private (not public)

## Next Steps

Once you've completed this setup and verified all checkpoints:

1. Mark tasks T017, T018, T019, T025, T030 as complete in `tasks.md`
2. Commit the changes:
   ```bash
   git add .
   git commit -m "Configure Supabase project and database"
   ```
3. Continue with **Phase 3: User Story 1 - Authentication** implementation

## Security Notes

⚠️ **IMPORTANT**:
- **NEVER** commit `.env.local` to git (it's in `.gitignore`)
- **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Only use `NEXT_PUBLIC_SUPABASE_ANON_KEY` in browser
- Keep your database password secure

## Support

If you encounter issues not covered in troubleshooting:
1. Check [Supabase Documentation](https://supabase.com/docs)
2. Review [Prisma Documentation](https://www.prisma.io/docs)
3. Check the quickstart guide: `specs/001-pet-management-crud/quickstart.md`

---

**Setup completed?** You're ready to implement authentication! 🚀
