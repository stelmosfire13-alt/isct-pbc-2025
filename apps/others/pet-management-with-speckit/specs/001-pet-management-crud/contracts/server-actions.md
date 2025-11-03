# Server Actions API Contract

**Feature**: 001-pet-management-crud
**Date**: 2025-10-22
**Type**: Next.js Server Actions (not REST/GraphQL)

## Overview

This document defines the contracts for Server Actions in the pet management application. Server Actions replace traditional REST API endpoints in Next.js App Router applications, providing type-safe server-side functions callable from Client Components.

**Note**: This application uses Server Actions instead of API routes for better type safety and simpler data flow.

---

## Authentication Actions

Location: `actions/auth.ts`

### register

Register a new user account.

**Input** (FormData):
```typescript
{
  email: string;       // Valid email format, required
  password: string;    // Min 8 characters, required
}
```

**Output**:
```typescript
{
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
  };
  errors?: {
    email?: string[];
    password?: string[];
  };
}
```

**Business Logic**:
1. Validate email format
2. Validate password length (≥8 characters)
3. Check if email already exists (FR-005)
4. Create user via Supabase Auth
5. Auto-login after registration
6. Redirect to `/pets`

**Error Cases**:
- Email already registered: `{ success: false, message: "An account with this email already exists" }`
- Invalid email: `{ success: false, errors: { email: ["Please enter a valid email"] } }`
- Password too short: `{ success: false, errors: { password: ["Password must be at least 8 characters"] } }`
- Supabase error: `{ success: false, message: "Registration failed. Please try again." }`

**Related FRs**: FR-001, FR-002, FR-003, FR-005

---

### login

Authenticate existing user.

**Input** (FormData):
```typescript
{
  email: string;
  password: string;
  redirect?: string;   // Optional redirect destination after login
}
```

**Output**:
```typescript
{
  success: boolean;
  message: string;
  redirect?: string;
}
```

**Business Logic**:
1. Validate inputs
2. Authenticate with Supabase
3. Create session (FR-006)
4. Redirect to `redirect` parameter or `/pets`

**Error Cases**:
- Invalid credentials: `{ success: false, message: "Email or password is incorrect" }`
- Empty fields: `{ success: false, message: "Email and password are required" }`
- Supabase error: `{ success: false, message: "Login failed. Please try again." }`

**Related FRs**: FR-004, FR-006

---

### logout

Terminate user session.

**Input**: None

**Output**:
```typescript
{
  success: boolean;
  message: string;
}
```

**Business Logic**:
1. Get current session
2. Call Supabase `signOut()`
3. Clear cookies
4. Redirect to `/login`

**Error Cases**:
- Not authenticated: `{ success: false, message: "No active session" }`
- Logout failed: `{ success: false, message: "Logout failed. Please try again." }`

**Related FRs**: FR-007

---

## Pet Management Actions

Location: `actions/pets.ts`

### getPets

List all pets for authenticated user.

**Input** (optional query params):
```typescript
{
  page?: number;       // Default: 0
  limit?: number;      // Default: 20, Max: 100
  sortBy?: 'created_at' | 'name'; // Default: 'created_at'
  order?: 'asc' | 'desc';         // Default: 'desc'
}
```

**Output**:
```typescript
{
  success: boolean;
  pets: Array<{
    id: string;
    name: string;
    category: string;
    birthday: string;    // ISO date string
    gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    imagePath: string | null;
    imageUrl: string | null;  // Public URL or signed URL
    createdAt: string;        // ISO timestamp
    updatedAt: string;
  }>;
  total: number;
  page: number;
  hasMore: boolean;
}
```

**Business Logic**:
1. Verify authentication
2. Query pets filtered by `user_id` (RLS enforces this)
3. Sort and paginate results
4. Generate signed URLs for images
5. Return pet list

**Error Cases**:
- Not authenticated: Redirect to `/login`
- Database error: `{ success: false, message: "Failed to load pets" }`

**Performance**:
- Target: <2 seconds for 100 pets (SC-004)
- Uses index on `user_id` and `created_at`

**Related FRs**: FR-008, FR-009

---

### getPet

Get single pet detail by ID.

**Input**:
```typescript
{
  id: string;  // UUID
}
```

**Output**:
```typescript
{
  success: boolean;
  pet?: {
    id: string;
    name: string;
    category: string;
    birthday: string;
    gender: string;
    imagePath: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}
```

**Business Logic**:
1. Verify authentication
2. Fetch pet by ID (RLS ensures ownership)
3. Generate signed URL for image
4. Return pet data

**Error Cases**:
- Not authenticated: Redirect to `/login`
- Pet not found: `{ success: false, message: "Pet not found" }` (returns 404 for both non-existent and unauthorized)
- Database error: `{ success: false, message: "Failed to load pet" }`

**Related FRs**: FR-009, FR-018

---

### createPet

Register a new pet.

**Input** (FormData):
```typescript
{
  name: string;           // 1-50 chars, required
  category: string;       // 1-50 chars, required
  birthday: string;       // ISO date, required, not in future
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';  // required
  image?: File;          // Optional, JPEG/PNG, max 20MB
}
```

**Output**:
```typescript
{
  success: boolean;
  message: string;
  pet?: {
    id: string;
    name: string;
    category: string;
    birthday: string;
    gender: string;
    imagePath: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
  errors?: {
    name?: string[];
    category?: string[];
    birthday?: string[];
    gender?: string[];
    image?: string[];
  };
}
```

**Business Logic**:
1. Verify authentication
2. Validate all required fields (FR-013)
3. Validate birthday not in future (FR-022)
4. If image provided:
   - Validate file type (JPEG/PNG) (FR-012)
   - Validate file size (≤20MB) (FR-020)
   - Compress image client-side
   - Upload to Supabase Storage
5. Create pet record in database
6. Return created pet with image URL
7. Revalidate `/pets` cache

**Error Cases**:
- Validation errors: `{ success: false, errors: { name: ["Name is required"] } }`
- Birthday in future: `{ success: false, errors: { birthday: ["Birthday cannot be in the future"] } }`
- Invalid image type: `{ success: false, errors: { image: ["Only JPEG and PNG formats are supported"] } }`
- Image too large: `{ success: false, errors: { image: ["Image must be under 20MB"] } }`
- Upload failed: `{ success: false, message: "Failed to upload image. Please try again." }`
- Database error: `{ success: false, message: "Failed to create pet. Please try again." }`

**Performance**:
- Target: Complete in <2 minutes including image upload (SC-002)
- Image upload: <10 seconds for 20MB (SC-005)

**Related FRs**: FR-010, FR-011, FR-012, FR-013, FR-020, FR-022

---

### updatePet

Update existing pet profile.

**Input** (FormData):
```typescript
{
  id: string;            // UUID, required
  name?: string;         // 1-50 chars, optional
  category?: string;     // 1-50 chars, optional
  birthday?: string;     // ISO date, optional, not in future
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';  // optional
  image?: File;          // Optional, JPEG/PNG, max 20MB
  removeImage?: boolean; // If true, remove existing image
}
```

**Output**:
```typescript
{
  success: boolean;
  message: string;
  pet?: {
    id: string;
    name: string;
    category: string;
    birthday: string;
    gender: string;
    imagePath: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
  errors?: {
    name?: string[];
    category?: string[];
    birthday?: string[];
    gender?: string[];
    image?: string[];
  };
}
```

**Business Logic**:
1. Verify authentication
2. Verify ownership (RLS enforces this)
3. Validate provided fields
4. If new image:
   - Upload new image
   - Delete old image from storage
5. If `removeImage: true`:
   - Delete image from storage
   - Set `imagePath` to null
6. Update pet record
7. Return updated pet
8. Revalidate `/pets` and `/pets/[id]` cache

**Error Cases**:
- Not found/unauthorized: `{ success: false, message: "Pet not found" }`
- Validation errors: Same as `createPet`
- Update failed: `{ success: false, message: "Failed to update pet. Please try again." }`

**Related FRs**: FR-014, FR-015, FR-018

---

### deletePet

Delete pet entry (requires confirmation in UI).

**Input**:
```typescript
{
  id: string;  // UUID, required
}
```

**Output**:
```typescript
{
  success: boolean;
  message: string;
}
```

**Business Logic**:
1. Verify authentication
2. Verify ownership (RLS enforces this)
3. Get pet to retrieve image path
4. Delete pet record from database (FR-016)
5. Delete associated image from storage
6. Revalidate `/pets` cache
7. Redirect to `/pets`

**Error Cases**:
- Not found/unauthorized: `{ success: false, message: "Pet not found" }`
- Delete failed: `{ success: false, message: "Failed to delete pet. Please try again." }`

**UI Requirement**: Must show confirmation dialog before calling this action (FR-017)

**Related FRs**: FR-016, FR-017, FR-018

---

## Image Upload Actions

Location: `actions/upload.ts`

### generateImageUploadUrl

Generate signed URL for direct client-to-storage upload.

**Input**:
```typescript
{
  filename: string;    // Original filename
  fileType: string;    // MIME type (image/jpeg or image/png)
  fileSize: number;    // File size in bytes
}
```

**Output**:
```typescript
{
  success: boolean;
  uploadUrl?: string;     // Signed URL for upload (valid 60 seconds)
  storagePath?: string;   // Path where file will be stored
  message?: string;
}
```

**Business Logic**:
1. Verify authentication
2. Validate file type (JPEG/PNG)
3. Validate file size (≤20MB)
4. Generate unique filename with UUID
5. Create storage path: `{user_id}/pets/{uuid}-{sanitized_filename}`
6. Generate signed upload URL (60 second expiry)
7. Return signed URL and path

**Error Cases**:
- Not authenticated: `{ success: false, message: "Unauthorized" }`
- Invalid file type: `{ success: false, message: "Only JPEG and PNG formats are supported" }`
- File too large: `{ success: false, message: "Image must be under 20MB" }`
- URL generation failed: `{ success: false, message: "Failed to generate upload URL" }`

**Security**: Only authenticated users can generate URLs for their own folder

**Related FRs**: FR-011, FR-012, FR-020

---

### getImageSignedUrl

Get time-limited signed URL for viewing image (if needed for private images).

**Input**:
```typescript
{
  imagePath: string;  // Storage path
}
```

**Output**:
```typescript
{
  success: boolean;
  signedUrl?: string;  // URL valid for 1 hour
  message?: string;
}
```

**Business Logic**:
1. Verify authentication
2. Verify user owns this image (path starts with user_id)
3. Generate signed URL (1 hour expiry)
4. Return signed URL

**Error Cases**:
- Not authenticated: `{ success: false, message: "Unauthorized" }`
- Unauthorized access: `{ success: false, message: "You do not have permission to access this image" }`
- URL generation failed: `{ success: false, message: "Failed to generate image URL" }`

**Alternative**: If pet-images bucket is made public with RLS, this action may not be needed

**Related FRs**: FR-009, FR-018

---

## Validation Schemas

All Server Actions use shared Zod schemas for validation consistency.

Location: `lib/validations/`

### authSchema (auth.ts)

```typescript
export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
```

### petSchema (pet.ts)

```typescript
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
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say'], {
    errorMap: () => ({ message: 'Please select a valid gender' }),
  }),
  image: z.instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'Image must be under 20MB'
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only JPEG and PNG formats are supported'
    )
    .optional(),
});

export const petUpdateSchema = petSchema.partial();
```

---

## Error Handling Standards

All Server Actions follow consistent error handling:

### Success Response
```typescript
{
  success: true,
  message: "Success message",
  data: { /* result data */ }
}
```

### Validation Error Response
```typescript
{
  success: false,
  errors: {
    fieldName: ["Error message 1", "Error message 2"]
  },
  message: "Validation failed"
}
```

### Server Error Response
```typescript
{
  success: false,
  message: "User-friendly error message"
}
```

**Principles**:
- Never expose stack traces to users (FR-021)
- Map technical errors to user-friendly messages
- Always return structured objects (never throw for expected errors)
- Log detailed errors server-side for debugging
- Return 200 status with `success: false` for business logic errors
- Redirect for authentication errors

---

## Performance Targets

From Technical Context and Success Criteria:

| Action | Target | Related SC |
|--------|--------|------------|
| `register` | < 1 minute | SC-001 |
| `login` | < 3 seconds | SC-009 |
| `getPets` | < 2 seconds (100 pets) | SC-004 |
| `createPet` | < 2 minutes (with image) | SC-002 |
| `createPet` | < 10 seconds (image upload) | SC-005 |
| `updatePet` | < 3 seconds | SC-009 |
| `deletePet` | < 3 seconds | SC-009 |

---

## Security Checklist

✅ All actions verify authentication before proceeding
✅ RLS policies enforce data isolation at database level
✅ Input validation on both client and server
✅ File uploads validated for type, size, and content
✅ Signed URLs expire after short duration (60s upload, 1h view)
✅ Error messages never expose system internals
✅ FormData parsed safely (no prototype pollution)
✅ No SQL injection (Prisma uses parameterized queries)
✅ XSS protection (React escapes by default, no `dangerouslySetInnerHTML`)
✅ CSRF protection (Next.js Server Actions include CSRF tokens)

---

## Testing Strategy

### Unit Tests
- Test validation schemas with valid/invalid inputs
- Test error message formatting
- Mock Supabase and Prisma clients

### Integration Tests
- Test Server Actions with real Supabase instance
- Verify RLS policies prevent unauthorized access
- Test file upload flow end-to-end
- Test error handling for various failure scenarios

### E2E Tests (Playwright)
- Test complete user flows (register → login → create pet → delete pet)
- Test form validation displays correctly
- Test image upload with progress indicator
- Test concurrent operations (optimistic updates)

---

## Summary

**Total Actions**: 11
- Auth: 3 (register, login, logout)
- Pets: 5 (getPets, getPet, createPet, updatePet, deletePet)
- Images: 2 (generateImageUploadUrl, getImageSignedUrl)
- Common: 1 (getCurrentUser - utility)

**Type Safety**: All actions use TypeScript + Zod for end-to-end type safety

**Error Handling**: Consistent structured responses, never throw for expected errors

**Security**: Multi-layer (auth check + RLS + validation)

**Performance**: All actions meet defined targets (< 3s feedback, < 2min total including uploads)

This contract ensures all functional requirements (FR-001 through FR-022) are implemented with proper validation, error handling, and security.
