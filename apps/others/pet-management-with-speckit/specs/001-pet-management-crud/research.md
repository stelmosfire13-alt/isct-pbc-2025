# Research: Pet Management CRUD Application

**Feature**: 001-pet-management-crud
**Date**: 2025-10-22
**Status**: Complete

## Overview

This document consolidates technical research for implementing the pet management CRUD application using Next.js, TypeScript, Supabase, Prisma, and Tailwind CSS with shadcn/ui.

---

## 1. Authentication with Supabase and Next.js App Router

### Decision
Use `@supabase/ssr` with cookie-based authentication, implementing three separate client utilities (browser, server, middleware) with multi-layer protection (middleware + Server Component + RLS).

### Rationale
- **Official recommendation**: `@supabase/ssr` is the current official solution, replacing deprecated `@supabase/auth-helpers`
- **SSR compatibility**: Cookie-based sessions work across Server Components, Client Components, Server Actions, and middleware
- **Security**: HTTP-only cookies protect against XSS attacks; defense-in-depth prevents bypass (CVE-2025-29927 lesson)
- **Performance**: Server Components access auth state without client-side hydration
- **Row Level Security integration**: Seamlessly integrates with Supabase PostgreSQL RLS for database-level authorization

### Alternatives Considered
- **NextAuth.js (Auth.js)**: Additional complexity, doesn't integrate as well with Supabase RLS
- **Clerk**: Costs money after free tier, overkill for small-scale application
- **Custom JWT**: Security risks, significant development time, violates maintainability principles
- **Middleware-only protection**: CVE-2025-29927 proved this is insufficient; needs defense-in-depth

### Implementation Notes

**Three Client Utilities**:
```typescript
// lib/supabase/client.ts - Browser client for Client Components
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/server.ts - Server client for Server Components/Actions
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from Server Component - middleware handles refresh
          }
        },
      },
    }
  );
}

// lib/supabase/middleware.ts - Middleware for token refresh
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
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

  // CRITICAL: Always use getUser() for server validation
  const { data: { user } } = await supabase.auth.getUser();

  return { response: supabaseResponse, user };
}
```

**Three-Layer Protection**:

1. **Middleware** (Edge-level redirect):
```typescript
// middleware.ts
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

  return response;
}
```

2. **Server Component** (Page-level validation):
```typescript
// app/(dashboard)/pets/page.tsx
export default async function PetsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch with RLS protection
  const { data: pets } = await supabase
    .from('pets')
    .select('*');

  return <PetList pets={pets} />;
}
```

3. **Row Level Security** (Database-level):
```sql
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pets"
  ON pets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

**Critical Security Pattern**:
- Always use `getUser()` in server code (validates with Supabase servers)
- Never use `getSession()` in server code (can be spoofed)
- Client-side auth checks are for UI only, never security

---

## 2. Image Upload with Supabase Storage

### Decision
Hybrid signed URL approach: server action generates signed URL after validation, client uploads directly to Supabase Storage with progress tracking.

### Rationale
- **Bypasses Next.js body size limits**: Direct upload avoids 1MB server action limit
- **Better performance**: Files upload directly from browser to Supabase Storage CDN
- **Security maintained**: Server validates before generating signed URLs
- **Progress tracking**: Native Supabase `onUploadProgress` callback
- **Reduced server load**: No file streaming through Next.js server

### Alternatives Considered
- **Pure client-side**: Less secure, exposes storage credentials
- **Pure server-side**: Hits 1MB body limit, wastes server bandwidth
- **Server-side with Sharp processing**: Unnecessary complexity for display-only images

### Implementation Notes

**Client-side compression** (before upload):
```typescript
import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 2,
  maxWidthOrHeight: 2048,
  useWebWorker: true,
  fileType: 'image/jpeg',
  initialQuality: 0.85
};

const compressedFile = file.size > 30 * 1024
  ? await imageCompression(file, options)
  : file;
```

**Two-stage validation** (client + server):
```typescript
// Client-side (immediate feedback)
const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

function validateFile(file: File) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG and PNG files are allowed');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('File must be under 20MB');
  }
}

// Server-side (security gate)
'use server';
export async function validateAndGenerateUploadUrl(
  filename: string,
  fileType: string,
  fileSize: number
) {
  // Validate user authentication
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  // Validate file metadata
  if (!ACCEPTED_TYPES.includes(fileType)) {
    throw new Error('Invalid file type');
  }
  if (fileSize > MAX_SIZE) {
    throw new Error('File too large');
  }

  // Generate unique path
  const uuid = crypto.randomUUID();
  const ext = filename.split('.').pop();
  const path = `${user.id}/pets/${uuid}.${ext}`;

  return { path, uploadUrl };
}
```

**Storage organization**:
```
Pattern: {user_id}/pets/{uuid}-{sanitized_name}.{ext}

Example:
user123/pets/a1b2c3d4-fluffy-profile.jpg
```

**Retry logic with exponential backoff**:
```typescript
async function uploadWithRetry(file: File, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.storage
        .from('pet-images')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setProgress((progress.loaded / progress.total) * 100);
          }
        });

      if (error) throw error;
      return data;

    } catch (error) {
      if (attempt < maxRetries - 1) {
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }
}
```

**RLS policies for storage**:
```sql
-- Users can upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pet-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own files
CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'pet-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

**Image serving with transformations**:
```typescript
// Serve optimized versions
const url = supabase.storage
  .from('pet-images')
  .getPublicUrl(path, {
    transform: {
      width: 800,
      height: 600,
      quality: 80,
      format: 'webp'
    }
  });
```

---

## 3. Form Validation Strategy

### Decision
Hybrid dual validation using Zod for schema definition, React Hook Form for client-side, and Server Actions with `useActionState` for server-side validation.

### Rationale
- **Type-safe end-to-end**: Shared Zod schema ensures consistency between client and server
- **Optimal UX**: React Hook Form provides instant feedback with minimal re-renders
- **Security**: Server-side validation mandatory (client can be bypassed)
- **Single source of truth**: One schema defines types, client validation, and server validation
- **Modern React patterns**: `useActionState` (React 19/Next.js 15) manages server state cleanly

### Alternatives Considered
- **Server-only validation**: Simpler but poor UX with delayed feedback
- **Client-only validation**: Security risk, easily bypassed
- **Yup instead of Zod**: Weaker TypeScript integration
- **Separate validation logic**: Code duplication, risk of inconsistency

### Implementation Notes

**Shared Zod schemas**:
```typescript
// lib/validations/pet.ts
import { z } from 'zod';

export const petSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name must be under 50 characters'),
  category: z.string()
    .min(1, 'Category is required'),
  birthday: z.coerce.date()
    .max(new Date(), 'Birthday cannot be in the future')
    .refine(
      (date) => date.getFullYear() > 1900,
      'Please enter a valid birthday'
    ),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  image: z.instanceof(File)
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      'Image must be under 20MB'
    )
    .refine(
      (file) => ['image/jpeg', 'image/png'].includes(file.type),
      'Only JPEG and PNG formats supported'
    )
    .optional(),
});

export type PetFormData = z.infer<typeof petSchema>;
```

**Client-side with React Hook Form**:
```typescript
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import { createPet } from './actions';
import { petSchema } from '@/lib/validations/pet';

export function PetForm() {
  const [state, formAction, isPending] = useActionState(createPet, null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(petSchema),
    mode: 'onBlur', // Validate after field loses focus
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Pet Name</label>
        <input
          id="name"
          {...register('name')}
          aria-invalid={errors.name ? 'true' : 'false'}
          className={errors.name ? 'border-red-500' : 'border-gray-300'}
        />
        {errors.name && (
          <p className="text-red-600 text-sm" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Pet'}
      </button>

      {state?.message && (
        <p className={state.success ? 'text-green-600' : 'text-red-600'}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

**Server-side validation in Server Actions**:
```typescript
'use server';
import { petSchema } from '@/lib/validations/pet';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createPet(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  // Parse and validate
  const result = petSchema.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    birthday: formData.get('birthday'),
    gender: formData.get('gender'),
    image: formData.get('image'),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: 'Validation failed',
    };
  }

  try {
    // Create pet in database
    const { data: pet, error } = await supabase
      .from('pets')
      .insert({
        ...result.data,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/pets');
    return { success: true, message: 'Pet created successfully', pet };

  } catch (error) {
    return { success: false, message: 'Failed to create pet' };
  }
}
```

**Validation timing (REPL pattern - Reward Early, Punish Late)**:
- **Empty fields**: Only validate on submit (avoid premature "required" errors)
- **Format fields** (email, phone): Validate on blur
- **Complex constraints** (password strength): Validate on change with checklist UI
- **Async validation** (username availability): Debounced onChange

**Error display patterns**:
- **Inline field-level**: Show errors directly below each field
- **Form-level summary**: Provide overall status for server errors
- **Accessibility**: Use `aria-invalid` and `role="alert"`
- **Clear and actionable**: Specific messages telling users how to fix

---

## 4. Best Practices Summary

### Authentication
- ✅ Use `@supabase/ssr` with cookie-based sessions
- ✅ Implement three-layer protection (middleware, Server Component, RLS)
- ✅ Always use `getUser()` in server code, never `getSession()`
- ✅ Enable Row Level Security on all tables
- ✅ Client-side checks for UI only, never security

### Image Upload
- ✅ Two-stage validation (client + server)
- ✅ Client-side compression before upload
- ✅ Direct upload to Supabase Storage with signed URLs
- ✅ Progress tracking with `onUploadProgress`
- ✅ Retry logic with exponential backoff
- ✅ User-scoped storage paths: `{user_id}/pets/{uuid}.{ext}`
- ✅ Serve optimized versions with Supabase transformations

### Form Validation
- ✅ Shared Zod schemas for client and server
- ✅ React Hook Form for client-side UX
- ✅ Server Actions with mandatory server-side validation
- ✅ REPL pattern (Reward Early, Punish Late)
- ✅ Inline errors + form-level summary
- ✅ Accessible error messages with ARIA attributes

### Performance
- ✅ Server Components for initial render (no hydration)
- ✅ Client Components only where interactivity needed
- ✅ Image compression reduces upload time
- ✅ Supabase CDN serves optimized images
- ✅ Validate on blur (not every keystroke)

### Security
- ✅ Defense-in-depth (never single layer of protection)
- ✅ Always validate server-side (client can be bypassed)
- ✅ HTTP-only cookies (XSS protection)
- ✅ RLS policies (database-level authorization)
- ✅ File signature validation (prevent malicious uploads)
- ✅ Rate limiting via Supabase defaults

### NPM Supply Chain Security (2025 Aug/Sep Attack Response)
- ✅ Exact version pinning (no `^` or `~` in package.json)
- ✅ `--frozen-lockfile` for all installs (CI/CD enforced)
- ✅ Install scripts disabled by default (`ignore-scripts=true`)
- ✅ Security audits run on every install (`audit-level=moderate`)
- ✅ Manual review required for all dependency updates
- ✅ Lock file changes monitored in pull requests
- ✅ Only trusted packages from verified maintainers
- ✅ Package source verification before first install

---

## Dependencies to Install

**IMPORTANT**: All versions are exact (no `^` or `~`) to prevent supply chain attacks.

```json
{
  "dependencies": {
    "next": "15.0.2",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@supabase/ssr": "0.5.1",
    "@supabase/supabase-js": "2.45.4",
    "@prisma/client": "5.20.0",
    "react-hook-form": "7.53.0",
    "zod": "3.23.8",
    "@hookform/resolvers": "3.9.0",
    "browser-image-compression": "2.0.2",
    "tailwindcss": "3.4.13",
    "@radix-ui/react-dialog": "1.1.1",
    "@radix-ui/react-dropdown-menu": "2.1.1",
    "@radix-ui/react-label": "2.1.0",
    "@radix-ui/react-select": "2.1.1",
    "@radix-ui/react-slot": "1.1.0",
    "class-variance-authority": "0.7.0",
    "clsx": "2.1.1",
    "tailwind-merge": "2.5.2",
    "lucide-react": "0.446.0"
  },
  "devDependencies": {
    "prisma": "5.20.0",
    "typescript": "5.6.3",
    "@types/node": "22.7.4",
    "@types/react": "18.3.10",
    "@types/react-dom": "18.3.0",
    "jest": "29.7.0",
    "@testing-library/react": "16.0.1",
    "@testing-library/jest-dom": "6.5.0",
    "jest-environment-jsdom": "29.7.0",
    "@playwright/test": "1.47.2",
    "eslint": "9.13.0",
    "eslint-config-next": "15.0.2",
    "prettier": "3.3.3"
  }
}
```

**Security Note**: These exact versions were verified on 2025-10-22. Before updating, always:
1. Review CHANGELOG for security advisories
2. Check npm audit results
3. Verify maintainers haven't changed
4. Test thoroughly before committing

---

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database (Supabase provides this)
DATABASE_URL=your_supabase_database_url
DIRECT_URL=your_supabase_direct_url

# Deployment (Vercel)
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

---

## Next Steps

With research complete, proceed to Phase 1:
1. Generate data model (data-model.md)
2. Create API contracts (contracts/)
3. Write quickstart guide (quickstart.md)
4. Update agent context with technology stack

All unknowns have been resolved. Implementation can proceed with confidence.
