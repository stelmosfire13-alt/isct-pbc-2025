# Quickstart Guide: Pet Management CRUD Application

**Feature**: 001-pet-management-crud
**Date**: 2025-10-22
**Estimated Setup Time**: 30-45 minutes

## Overview

This guide will help you set up the development environment and get the pet management application running locally.

---

## Prerequisites

Before starting, ensure you have:

- **Node.js**: v18.17 or later ([Download](https://nodejs.org/))
- **pnpm** (recommended), npm, or yarn
- **Git**: For version control
- **Supabase Account**: Free tier ([Sign up](https://supabase.com/))
- **Vercel Account** (for deployment): Free tier ([Sign up](https://vercel.com/))
- **Code Editor**: VS Code recommended with these extensions:
  - Prisma
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

---

## Project Setup

### 1. Initialize Next.js Project

```bash
# Create Next.js project with TypeScript and App Router
npx create-next-app@latest pet-management --typescript --tailwind --app --src-dir=false --import-alias="@/*"

cd pet-management
```

**Configuration prompts**:
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ App Router
- ✅ Import alias (@/*)
- ❌ src/ directory (we'll use root-level directories)

### 2. Configure Package Manager Security (NPM Supply Chain Protection)

**Context**: In response to August/September 2025 npm supply chain attacks, we enforce strict security measures.

Create `.npmrc` (or `.pnpmrc` for pnpm) in project root:

```ini
# Security: Exact versions only (no ranges)
save-exact=true

# Security: Run audit on every install
audit-level=moderate

# Security: Disable install scripts by default
ignore-scripts=true

# Disable funding messages
fund=false

# Strict peer dependencies
strict-peer-dependencies=true
```

Update `package.json` with security scripts:

```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm",
    "install:safe": "pnpm install --frozen-lockfile",
    "audit": "pnpm audit --audit-level=moderate",
    "audit:fix": "pnpm audit --fix"
  },
  "engines": {
    "node": ">=18.17.0",
    "pnpm": ">=8.0.0"
  }
}
```

### 3. Install Dependencies (Secure Process)

**IMPORTANT**: All packages use exact versions (no `^` or `~` ranges) to prevent malicious updates.

```bash
# Install with frozen lockfile (fails if dependencies changed)
pnpm install --frozen-lockfile

# If first install (creates lock file)
pnpm install

# Core dependencies (exact versions from 2025-10-22)
pnpm add @supabase/ssr@0.5.1 @supabase/supabase-js@2.45.4 @prisma/client@5.20.0 react-hook-form@7.53.0 zod@3.23.8 @hookform/resolvers@3.9.0 browser-image-compression@2.0.2

# shadcn/ui dependencies
pnpm add class-variance-authority@0.7.0 clsx@2.1.1 tailwind-merge@2.5.2 lucide-react@0.446.0

# Radix UI components (installed via shadcn)
pnpm add @radix-ui/react-dialog@1.1.1 @radix-ui/react-dropdown-menu@2.1.1 @radix-ui/react-label@2.1.0 @radix-ui/react-select@2.1.1 @radix-ui/react-slot@1.1.0

# Development dependencies (exact versions)
pnpm add -D prisma@5.20.0 @types/node@22.7.4 @types/react@18.3.10 @types/react-dom@18.3.0 @testing-library/react@16.0.1 @testing-library/jest-dom@6.5.0 jest@29.7.0 jest-environment-jsdom@29.7.0 @playwright/test@1.47.2

# Enable scripts only for trusted packages
pnpm rebuild @prisma/client
pnpm rebuild @playwright/test

# Run security audit
pnpm audit
```

**Security Verification Checklist**:
- ✅ All versions are exact (no `^` or `~`)
- ✅ `pnpm-lock.yaml` is committed to git
- ✅ Audit shows no high/critical vulnerabilities
- ✅ Install scripts only run for @prisma and @playwright

### 4. Initialize shadcn/ui

```bash
# Initialize shadcn/ui (creates components.json)
npx shadcn@latest init

# Install required components
npx shadcn@latest add button
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add card
npx shadcn@latest add alert
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

**shadcn/ui configuration**:
- Style: Default
- Base color: Slate
- CSS variables: Yes

---

## Supabase Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Fill in project details:
   - Name: `pet-management`
   - Database Password: (generate strong password, save it!)
   - Region: Choose closest to your users
4. Wait 2-3 minutes for project to be created

### 2. Enable Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled (enabled by default)
3. Go to **Authentication** → **URL Configuration**:
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: Add `http://localhost:3000/auth/callback`
4. (Optional) Go to **Authentication** → **Email Templates** to customize email templates

### 3. Create Storage Bucket

1. Go to **Storage** in sidebar
2. Click "New Bucket"
3. Name: `pet-images`
4. Public bucket: **No** (keep private)
5. File size limit: `20971520` bytes (20MB)
6. Allowed MIME types: `image/jpeg, image/png`
7. Click "Create bucket"

### 4. Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values (you'll need them):
   - Project URL: `https://xxxxx.supabase.co`
   - API Key (anon/public): `eyJhbGc...`
   - Service Role Key: `eyJhbGc...` (keep secret!)

### 5. Get Database Connection Strings

1. Go to **Settings** → **Database**
2. Scroll to "Connection string"
3. Copy:
   - Connection string (for Prisma): `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - Direct connection (for migrations): `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true`

---

## Environment Configuration

Create `.env.local` file in project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Database (for Prisma)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important**: Add `.env.local` to `.gitignore` (Next.js does this by default)

---

## Database Setup with Prisma

### 1. Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma`
- `.env` file (you can delete this, we use `.env.local`)

### 2. Configure Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Pet {
  id         String   @id @default(uuid()) @db.Uuid
  userId     String   @map("user_id") @db.Uuid
  name       String   @db.VarChar(50)
  category   String   @db.VarChar(50)
  birthday   DateTime @db.Date
  gender     String   @db.VarChar(20)
  imagePath  String?  @map("image_path") @db.Text
  createdAt  DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt  DateTime @updatedAt @map("updated_at") @db.Timestamptz

  @@index([userId], name: "idx_pets_user_id")
  @@index([createdAt], name: "idx_pets_created_at")
  @@map("pets")
}
```

### 3. Create Initial Migration

```bash
npx prisma migrate dev --name init
```

This will:
- Create `pets` table in Supabase
- Generate Prisma Client
- Apply migration

### 4. Apply Row Level Security

In Supabase Dashboard, go to **SQL Editor** and run:

```sql
-- Enable RLS on pets table
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own pets
CREATE POLICY "Users can view own pets"
ON pets
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can insert their own pets
CREATE POLICY "Users can create own pets"
ON pets
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own pets
CREATE POLICY "Users can update own pets"
ON pets
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own pets
CREATE POLICY "Users can delete own pets"
ON pets
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

### 5. Apply Storage RLS

In **SQL Editor**, run:

```sql
-- Policy: Users can upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pet-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own images
CREATE POLICY "Users can view own images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'pet-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own images
CREATE POLICY "Users can update own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pet-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pet-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Project Structure

Create the following directory structure:

```bash
mkdir -p app/\(auth\)/{login,register}
mkdir -p app/\(dashboard\)/pets/{new,\[id\]/edit}
mkdir -p app/api/auth
mkdir -p components/{ui,forms,pets,layout}
mkdir -p lib/{supabase,validations,utils}
mkdir -p actions
mkdir -p types
mkdir -p tests/{unit,integration,e2e}
```

**Note**: The `(auth)` and `(dashboard)` are route groups (parentheses are part of the folder name).

---

## Key Files to Create

### 1. Supabase Client Utilities

**`lib/supabase/client.ts`**:
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**`lib/supabase/server.ts`**:
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component
          }
        },
      },
    }
  );
}
```

**`lib/supabase/middleware.ts`**:
```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  return { response: supabaseResponse, user };
}
```

### 2. Middleware

**`middleware.ts`** (in project root):
```typescript
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  // Protected routes
  if (request.nextUrl.pathname.startsWith('/pets')) {
    if (!user) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Auth routes (redirect to dashboard if already logged in)
  if (['/login', '/register'].includes(request.nextUrl.pathname)) {
    if (user) {
      return NextResponse.redirect(new URL('/pets', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### 3. Prisma Client

**`lib/prisma.ts`**:
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 4. Validation Schemas

**`lib/validations/auth.ts`**:
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
```

**`lib/validations/pet.ts`**:
```typescript
import { z } from 'zod';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export const petSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name must be under 50 characters'),
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category must be under 50 characters'),
  birthday: z.coerce.date()
    .max(new Date(), 'Birthday cannot be in the future')
    .refine(
      (date) => date.getFullYear() > 1900,
      'Please enter a valid birthday'
    ),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  image: z.instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Image must be under 20MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only JPEG and PNG formats are supported'
    )
    .optional(),
});

export type PetFormData = z.infer<typeof petSchema>;
```

---

## Development Workflow

### 1. Start Development Server

```bash
pnpm dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### 2. View Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Visit: [http://localhost:5555](http://localhost:5555)

### 3. Generate Prisma Client (after schema changes)

```bash
npx prisma generate
```

### 4. Create New Migration

```bash
npx prisma migrate dev --name description_of_change
```

### 5. Reset Database (development only!)

```bash
npx prisma migrate reset
```

### 6. Update Dependencies (Secure Process)

**IMPORTANT**: Never use `pnpm update` without review. Each update must be manually verified.

```bash
# Check for available updates
pnpm outdated

# Review package before updating (one at a time)
npm view <package-name> versions
npm view <package-name> time
npm view <package-name> maintainers

# Update single package after verification
pnpm update <package-name> --latest

# Verify lock file changes
git diff pnpm-lock.yaml

# Run tests after update
pnpm test
pnpm build

# Run security audit
pnpm audit

# Commit with explicit version info
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): update <package> from x.y.z to a.b.c"
```

**Update Review Checklist**:
- [ ] Check CHANGELOG/release notes for breaking changes
- [ ] Verify package maintainers haven't changed
- [ ] No new install scripts added
- [ ] Security audit passes after update
- [ ] All tests pass
- [ ] Application builds successfully
- [ ] Manual smoke testing completed

---

## Testing Setup

### Jest Configuration

**`jest.config.js`**:
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

**`jest.setup.js`**:
```javascript
import '@testing-library/jest-dom';
```

### Playwright Configuration

```bash
npx playwright install
```

**`playwright.config.ts`**:
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Run Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm playwright test

# E2E with UI
pnpm playwright test --ui
```

---

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm lint                   # Run ESLint
pnpm format                 # Format with Prettier (if configured)

# Database
npx prisma studio           # Open database GUI
npx prisma migrate dev      # Create and apply migration
npx prisma generate         # Regenerate Prisma Client
npx prisma migrate reset    # Reset database (dev only)
npx prisma db push          # Push schema without migration (dev only)

# Testing
pnpm test                   # Run Jest tests
pnpm test:watch             # Run Jest in watch mode
pnpm playwright test        # Run E2E tests
pnpm playwright test --ui   # Run E2E with UI

# Security (NPM Supply Chain Protection)
pnpm audit                  # Check for vulnerabilities
pnpm audit --fix            # Auto-fix vulnerabilities (review first!)
pnpm outdated               # Check for available updates
pnpm install --frozen-lockfile  # Install with exact lock file
pnpm store prune            # Clear package cache

# Deployment
vercel                      # Deploy to Vercel
vercel --prod               # Deploy to production
```

---

## Troubleshooting

### Issue: Prisma Client not found

**Solution**:
```bash
npx prisma generate
```

### Issue: Database connection error

**Solution**:
- Check `.env.local` has correct database URL
- Ensure Supabase project is active
- Verify database password is correct
- Check if IP is allowed (Supabase allows all by default)

### Issue: Middleware infinite redirect

**Solution**:
- Check matcher pattern in `middleware.ts`
- Ensure static assets are excluded
- Verify user authentication logic

### Issue: Image upload fails

**Solution**:
- Check Supabase Storage bucket exists (`pet-images`)
- Verify RLS policies are applied to `storage.objects`
- Check file size and type validation
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and key are correct

### Issue: TypeScript errors after Prisma changes

**Solution**:
```bash
npx prisma generate
# Restart TypeScript server in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Issue: `pnpm install` fails with "Install scripts disabled"

**Context**: Install scripts are disabled by default for security (2025 Aug/Sep npm attacks).

**Solution**:
```bash
# Install without scripts first
pnpm install --ignore-scripts

# Then rebuild only trusted packages
pnpm rebuild @prisma/client
pnpm rebuild @playwright/test
```

### Issue: Dependency audit fails with vulnerabilities

**Solution**:
```bash
# View detailed audit report
pnpm audit --json

# Check if vulnerabilities are in production dependencies
pnpm audit --prod

# If safe to fix automatically (review changes!)
pnpm audit --fix

# If critical, update specific package
pnpm update <vulnerable-package> --latest

# Always verify after fix
pnpm audit
pnpm test
pnpm build
```

### Issue: Lock file out of sync

**Solution**:
```bash
# Never manually edit pnpm-lock.yaml

# If package.json was edited, reinstall
pnpm install

# If lock file is corrupted
rm pnpm-lock.yaml
pnpm install

# Commit both files together
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): update dependencies"
```

### Issue: Suspicious package or supply chain attack detected

**Immediate Actions**:
```bash
# 1. Stop all servers
# 2. Disconnect from network

# 3. Document the incident
npm view <suspicious-package> > incident-report.txt
cp pnpm-lock.yaml pnpm-lock.yaml.backup

# 4. Remove suspicious package
pnpm remove <suspicious-package>

# 5. Clear cache
pnpm store prune
rm -rf node_modules
pnpm install --frozen-lockfile

# 6. Rotate ALL secrets immediately
# - Supabase keys
# - Database passwords
# - Vercel tokens
# - GitHub tokens

# 7. Report to npm
# Visit: https://www.npmjs.com/support
```

---

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: (default)
   - Output Directory: (default)

### 3. Add Environment Variables

In Vercel project settings → Environment Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SITE_URL` (your Vercel URL)

### 4. Update Supabase Auth URLs

In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: Add `https://your-app.vercel.app/auth/callback`

### 5. Deploy

Vercel deploys automatically on push to main branch.

---

## Next Steps

1. Review the [Feature Specification](./spec.md)
2. Read the [Implementation Plan](./plan.md)
3. Check the [Data Model](./data-model.md)
4. Review [API Contracts](./contracts/server-actions.md)
5. Start implementing using `/speckit.tasks`

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

---

## Support

For issues specific to this project, refer to:
- Feature specification: `spec.md`
- Implementation plan: `plan.md`
- Data model: `data-model.md`
- API contracts: `contracts/server-actions.md`

Ready to start building! 🚀
