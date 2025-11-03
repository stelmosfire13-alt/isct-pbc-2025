# Implementation Tasks: Pet Management CRUD Application

**Feature**: 001-pet-management-crud
**Branch**: `001-pet-management-crud`
**Created**: 2025-10-22
**Total Estimated Tasks**: 134

## Overview

This document provides a dependency-ordered task list for implementing the Pet Management CRUD application. Tasks are organized by user story (US1-US5) to enable independent implementation and incremental delivery.

### User Stories Summary

1. **US1 (P1)**: User Account Registration and Login - 16 tasks
2. **US2 (P2)**: View Pet List and Details - 13 tasks
3. **US3 (P3)**: Register New Pet - 17 tasks
4. **US4 (P4)**: Update Pet Profile - 13 tasks
5. **US5 (P5)**: Delete Pet Entry - 8 tasks

### Implementation Strategy

- **MVP Scope**: User Story 1 (US1) only - Authentication foundation
- **Incremental Delivery**: Each story is independently testable and deliverable
- **Parallel Execution**: Tasks marked with `[P]` can run in parallel with other `[P]` tasks
- **Test-Driven**: Tests written before implementation per constitution requirements

---

## Phase 1: Setup & Infrastructure

**Goal**: Initialize project with all dependencies, tooling, and security configurations.

**Duration**: ~2-3 hours

**Prerequisites**: Node.js 18.17+, pnpm, Supabase account, Vercel account

### Tasks

- [X] T001 [P] Initialize Next.js project with TypeScript and App Router using `create-next-app`
- [X] T002 Configure package manager security in `.npmrc` with exact versions, audit level, and disabled install scripts per quickstart.md
- [X] T003 [P] Create directory structure for app routes: `app/(auth)`, `app/(dashboard)/pets`, `components/`, `lib/`, `actions/`, `types/`, `tests/`
- [X] T004 [P] Install core dependencies with exact versions in `package.json`: Next.js 14.2.32 (patched), React 18.3.1, @supabase/ssr 0.7.0, @supabase/supabase-js 2.76.1, @prisma/client 5.20.0
- [X] T005 [P] Install form/validation dependencies: react-hook-form 7.53.0, zod 3.23.8, @hookform/resolvers 3.9.0, browser-image-compression 2.0.2
- [X] T006 [P] Install UI dependencies: tailwindcss 3.4.13, shadcn/ui components (class-variance-authority, clsx, tailwind-merge, lucide-react)
- [X] T007 [P] Install dev dependencies: prisma 5.20.0, typescript 5.6.3, @types/* packages, jest 29.7.0, @testing-library/react 16.0.1, @playwright/test 1.56.1
- [X] T008 Run `pnpm audit` and verify no high/critical vulnerabilities, rebuild only @prisma/client and @playwright/test scripts
- [X] T009 Initialize shadcn/ui with `npx shadcn@latest init` and install components: button, form, input, label, select, card, alert, dialog, dropdown-menu, toast
- [X] T010 Configure ESLint and TypeScript strict mode in `tsconfig.json` with path aliases `@/*`
- [X] T011 Create `.env.local.example` with all required environment variables per quickstart.md
- [X] T012 [P] Configure Jest in `jest.config.js` with Next.js preset and setup file
- [X] T013 [P] Configure Playwright in `playwright.config.ts` with baseURL and webServer settings
- [X] T014 [P] Create `.gitignore` ensuring `.env.local`, `node_modules/`, `.next/`, coverage reports are excluded
- [X] T015 Add security scripts to `package.json`: `preinstall` (only-allow pnpm), `install:safe` (frozen lockfile), `audit`, `audit:fix`
- [X] T016 Commit initial project setup with locked dependencies in `pnpm-lock.yaml`

---

## Phase 2: Foundational Infrastructure

**Goal**: Set up Supabase, Prisma, authentication utilities, and middleware that all user stories depend on.

**Duration**: ~3-4 hours

**Prerequisites**: Phase 1 complete, Supabase project created

### Tasks

- [X] T017 Create Supabase project and enable email/password authentication provider
- [X] T018 Create Supabase Storage bucket `pet-images` (private, 20MB limit, JPEG/PNG only)
- [X] T019 Copy environment variables from Supabase dashboard to `.env.local`: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, DIRECT_URL
- [X] T020 [P] Create Supabase client utilities in `lib/supabase/client.ts` for browser using createBrowserClient
- [X] T021 [P] Create Supabase server client in `lib/supabase/server.ts` for Server Components with cookies integration
- [X] T022 [P] Create Supabase middleware utility in `lib/supabase/middleware.ts` with updateSession function using getUser()
- [X] T023 Create Next.js middleware in `middleware.ts` with route protection for /pets routes and auth redirects
- [X] T024 Configure Prisma schema in `prisma/schema.prisma` with Pet model per data-model.md (user_id, name, category, birthday, gender, image_path, timestamps, indexes)
- [ ] T025 Run `npx prisma migrate dev --name init` to create initial migration and apply to Supabase database (requires Supabase setup)
- [X] T026 Run Supabase SQL scripts to enable RLS on pets table with all four CRUD policies (SELECT, INSERT, UPDATE, DELETE) per data-model.md (SQL scripts created, ready to run)
- [X] T027 Run Supabase SQL scripts to create Storage RLS policies for pet-images bucket (INSERT, SELECT, DELETE) per data-model.md (SQL scripts created, ready to run)
- [X] T028 [P] Create Prisma client singleton in `lib/prisma.ts` with global instance management
- [X] T029 [P] Create error handling utility in `lib/utils/errors.ts` with user-friendly error mapping
- [ ] T030 Verify database connection and RLS policies work by running `npx prisma studio` (requires Supabase setup)
- [X] T031 Create test seed data script in `prisma/seed.ts` with sample pet data
- [X] T032 Commit foundational infrastructure

---

## Phase 3: User Story 1 - Authentication (P1)

**Goal**: Implement user registration, login, and logout with validation and session management.

**Independent Test**: User can register, login, and logout successfully. Session persists across page reloads.

**Duration**: ~4-5 hours

**Dependencies**: Phase 2 complete

### Tasks

#### Validation & Types

- [X] T033 [P] [US1] Create auth validation schemas in `lib/validations/auth.ts`: registerSchema (email, password min 8 chars), loginSchema per contracts/server-actions.md
- [X] T034 [P] [US1] Create auth types in `types/models.ts` for User, AuthResponse, AuthError

#### Server Actions

- [X] T035 [US1] Implement register Server Action in `actions/auth.ts`: validate with Zod, call Supabase signUp, auto-login, redirect to /pets, handle duplicate email error
- [X] T036 [US1] Implement login Server Action in `actions/auth.ts`: validate inputs, call Supabase signInWithPassword, create session, redirect to redirect param or /pets
- [X] T037 [US1] Implement logout Server Action in `actions/auth.ts`: call Supabase signOut, clear cookies, redirect to /login

#### UI Components

- [X] T038 [P] [US1] Create RegisterForm component in `components/forms/register-form.tsx` using React Hook Form, Zod resolver, display inline errors
- [X] T039 [P] [US1] Create LoginForm component in `components/forms/login-form.tsx` with email/password fields, redirect preservation, useActionState integration
- [X] T040 [P] [US1] Create auth layout in `app/(auth)/layout.tsx` with centered card, no navigation
- [X] T041 [US1] Create registration page in `app/(auth)/register/page.tsx` rendering RegisterForm with register action
- [X] T042 [US1] Create login page in `app/(auth)/login/page.tsx` rendering LoginForm with login action and redirect query param support
- [X] T043 [US1] Create root layout in `app/layout.tsx` with font, metadata, and global styles
- [X] T044 [US1] Create home page in `app/page.tsx` with redirect to /pets if authenticated or /login if not

#### Testing

- [X] T045 [P] [US1] Write unit tests for registerSchema and loginSchema in `tests/unit/validations/auth.test.ts`: test valid/invalid emails, password length, error messages
- [X] T046 [P] [US1] Write integration tests for register action in `tests/integration/actions/auth.test.ts`: test successful registration, duplicate email, invalid inputs, Supabase Auth integration
- [X] T047 [P] [US1] Write integration tests for login action: test successful login, invalid credentials, non-existent user, redirect preservation
- [X] T048 [US1] Write E2E test for registration flow in `tests/e2e/auth.spec.ts`: visit /register, fill form, submit, verify redirect to /pets and session cookie, test duplicate email rejection (register same email twice, verify error message)

#### Integration & Verification

- [X] T049 Test complete auth flow manually: register new user, logout, login again, verify middleware protects /pets
- [X] T050 Verify RLS works: try accessing another user's data via Prisma Studio
- [X] T051 Run all US1 tests: `pnpm test tests/unit/validations/auth` and `pnpm test tests/integration/actions/auth` and `pnpm playwright test tests/e2e/auth`
- [X] T052 Verify 80% code coverage for US1 with `pnpm test --coverage`
- [X] T053 Commit User Story 1 implementation

**MVP Checkpoint**: At this point, users can create accounts and authenticate. This is a shippable increment.

---

## Phase 4: User Story 2 - View Pet List and Details (P2)

**Goal**: Display list of user's pets and show detailed pet information.

**Independent Test**: Logged-in user with seeded pets can view list and click to see details. Empty state shows for users with no pets.

**Duration**: ~4-5 hours

**Dependencies**: Phase 3 complete (authentication), seed data created

### Tasks

#### Server Actions & Data Access

- [X] T054 [P] [US2] Implement getPets Server Action in `actions/pets.ts`: verify auth with getUser(), query Prisma with user_id filter, pagination (limit 20), orderBy createdAt desc, return pets array
- [X] T055 [P] [US2] Implement getPet Server Action in `actions/pets.ts`: verify auth, fetch single pet by ID, RLS ensures ownership, return pet or 404

#### UI Components

- [X] T056 [P] [US2] Create PetCard component in `components/pets/pet-card.tsx` displaying pet name, category, thumbnail image, link to detail page
- [X] T057 [P] [US2] Create PetDetail component in `components/pets/pet-detail.tsx` showing all pet fields (name, category, birthday, gender) and full-size image
- [X] T058 [P] [US2] Create Header component in `components/layout/header.tsx` with logo, navigation, user menu (email display, logout button)
- [X] T059 [P] [US2] Create Nav component in `components/layout/nav.tsx` with links to "My Pets" and "Add Pet"
- [X] T060 [US2] Create dashboard layout in `app/(dashboard)/layout.tsx` including Header and Nav components, Server Component fetching user for display
- [X] T061 [US2] Create pet list page in `app/(dashboard)/pets/page.tsx`: fetch pets with getPets action, map to PetCard components, show empty state if no pets with "Add your first pet" CTA button linking to /pets/new
- [X] T062 [US2] Create pet detail page in `app/(dashboard)/pets/[id]/page.tsx`: fetch pet with getPet action, render PetDetail, show edit/delete buttons, handle not found error

#### Testing

- [X] T063 [P] [US2] Write integration tests for getPets action in `tests/integration/actions/pets.test.ts`: test successful fetch, pagination, RLS isolation (user cannot see other user's pets), empty result
- [X] T064 [P] [US2] Write integration tests for getPet action: test successful fetch, not found, RLS enforcement (cannot access other user's pet)
- [X] T065 [P] [US2] Write component tests for PetCard in `tests/unit/components/pet-card.test.ts`: test rendering with mock data, image display, link href
- [X] T066 [US2] Write E2E test for view pet flow in `tests/e2e/pets.spec.ts`: login, navigate to /pets, verify pet list displays, click pet, verify detail page, verify back navigation
- [X] T066a [P] [US2] Write integration test for data persistence (FR-019) in `tests/integration/actions/pets.test.ts`: create pet, reload page, verify pet still exists, logout and login, verify pet persists across sessions

#### Integration & Verification

- [X] T067 Test manually: login as user with seed data, verify all pets display, click each pet, verify details render correctly, verify other user cannot see pets (test in incognito)
- [X] T068 Run all US2 tests: `pnpm test tests/integration/actions/pets` and `pnpm playwright test tests/e2e/pets`
- [X] T069 Verify 80% coverage maintained with `pnpm test --coverage`
- [X] T070 Commit User Story 2 implementation

**Delivery Checkpoint**: Users can now view their pets. This is a shippable increment.

---

## Phase 5: User Story 3 - Register New Pet (P3)

**Goal**: Allow users to create new pet entries with image upload.

**Independent Test**: Logged-in user can fill out pet form with all fields, upload image, submit, and see new pet in list.

**Duration**: ~5-6 hours

**Dependencies**: Phase 4 complete (can view pets)

### Tasks

#### Validation & Utilities

- [X] T071 [P] [US3] Create pet validation schema in `lib/validations/pet.ts`: petSchema with name (1-50 chars), category (1-50 chars), birthday (not future, after 1900), gender enum, image (JPEG/PNG, max 20MB, optional)
- [X] T072 [P] [US3] Create image utility functions in `lib/utils/image.ts`: compressImage (browser-image-compression), validateImageType, validateImageSize, generateStoragePath (user_id/pets/uuid-filename)

#### Server Actions

- [X] T073 [US3] Implement createPet Server Action in `actions/pets.ts`: verify auth, validate with petSchema, handle image upload to Supabase Storage if provided, create Prisma pet record with image_path, revalidatePath('/pets'), return created pet with errors array
- [ ] T074 [P] [US3] Implement generateImageUploadUrl action in `actions/upload.ts` (optional): verify auth, validate file metadata, generate signed upload URL for direct client upload (if using client-direct upload pattern)

#### UI Components

- [X] T075 [P] [US3] Create PetImageUpload component in `components/pets/pet-image-upload.tsx`: file input with image preview displayed before submission, client-side compression, progress indicator during upload, validation messages (type, size)
- [X] T076 [US3] Create PetForm component in `components/forms/pet-form.tsx`: React Hook Form with Zod resolver, fields for name, category, birthday (date picker), gender (select), image (PetImageUpload), inline field errors, form-level error summary, useActionState for server errors
- [X] T077 [US3] Create add pet page in `app/(dashboard)/pets/new/page.tsx`: render PetForm with createPet action, redirect to /pets on success

#### Testing

- [ ] T078 [P] [US3] Write unit tests for petSchema in `tests/unit/validations/pet.test.ts`: test all field validations (name length, category required, birthday not future, gender enum, image type/size), test error messages
- [ ] T079 [P] [US3] Write unit tests for image utilities: test compressImage, validateImageType, validateImageSize, generateStoragePath format
- [ ] T080 [P] [US3] Write integration tests for createPet action: test successful creation with image, without image, validation errors (missing fields, future birthday, invalid image), verify image uploaded to Supabase Storage, verify pet created in database, verify RLS (user_id set correctly)
- [ ] T081 [P] [US3] Write component tests for PetForm: test form validation triggers, error display, submission, loading state
- [ ] T082 [US3] Write E2E test for create pet flow: login, click "Add Pet", fill all fields, select image, submit, verify redirect to /pets, verify new pet appears in list, verify detail page shows correct data including image

#### Integration & Verification

- [ ] T083 Test manually: create pet with all fields and large image (test compression), create pet without image, test validation errors (empty fields, future birthday, oversized image), verify upload progress indicator
- [ ] T084 Run all US3 tests: `pnpm test tests/unit/validations/pet` and `pnpm test tests/integration/actions/pets` (createPet tests)
- [ ] T085 Verify 80% coverage maintained
- [ ] T086 Commit User Story 3 implementation

**Delivery Checkpoint**: Users can now add pets. Core CRUD (Create, Read) complete. This is a shippable increment.

---

## Phase 6: User Story 4 - Update Pet Profile (P4)

**Goal**: Allow users to edit existing pet information and replace images.

**Independent Test**: Logged-in user can edit any field of their pet, save changes, and see updates persist.

**Duration**: ~4-5 hours

**Dependencies**: Phase 5 complete (can create pets)

### Tasks

#### Server Actions

- [X] T087 [US4] Implement updatePet Server Action in `actions/pets.ts`: verify auth, verify ownership via RLS, validate with petSchema.partial(), handle new image upload (delete old image if replacing), handle removeImage flag (delete from storage, set null), update Prisma pet record, revalidatePath('/pets' and '/pets/[id]'), return updated pet

#### UI Components

- [X] T088 [US4] Update PetForm component to support edit mode: accept initialData prop, pre-populate fields, change submit button text to "Update Pet", add "Remove Image" checkbox if pet has image, add cancel button
- [X] T089 [US4] Create edit pet page in `app/(dashboard)/pets/[id]/edit/page.tsx`: fetch pet with getPet, render PetForm in edit mode with updatePet action, handle cancel navigation back to detail page

#### Testing

- [ ] T090 [P] [US4] Write integration tests for updatePet action: test update all fields, update single field, update with new image (verify old image deleted), removeImage flag (verify image deleted from storage), validation errors, RLS enforcement (cannot update other user's pet), pet not found error
- [ ] T091 [P] [US4] Write component tests for PetForm in edit mode: test fields pre-populated, cancel button, removeImage checkbox toggles
- [ ] T092 [US4] Write E2E test for update pet flow: login, navigate to pet detail, click edit, modify fields, upload new image, submit, verify updates persist on detail page, navigate back to list and verify changes

#### Integration & Verification

- [ ] T093 Test manually: edit pet changing all fields, edit only name, replace image (verify old deleted in Supabase Storage), remove image with checkbox (verify deleted), cancel edit (verify no changes), verify old image cleanup
- [ ] T094 Run all US4 tests: `pnpm test tests/integration/actions/pets` (updatePet tests) and `pnpm playwright test tests/e2e/pets`
- [ ] T095 Verify 80% coverage maintained
- [ ] T096 Commit User Story 4 implementation

**Delivery Checkpoint**: Users can now update pets. CRUD (Create, Read, Update) complete. This is a shippable increment.

---

## Phase 7: User Story 5 - Delete Pet Entry (P5)

**Goal**: Allow users to delete pets with confirmation dialog.

**Independent Test**: Logged-in user can delete a pet, confirm deletion, and see pet removed from list.

**Duration**: ~2-3 hours

**Dependencies**: Phase 6 complete (can update pets)

### Tasks

#### Server Actions

- [X] T097 [US5] Implement deletePet Server Action in `actions/pets.ts`: verify auth, verify ownership via RLS, fetch pet to get image_path, delete pet from Prisma, delete image from Supabase Storage if exists, revalidatePath('/pets'), redirect to /pets

#### UI Components

- [X] T098 [P] [US5] Create DeletePetDialog component in `components/pets/delete-pet-dialog.tsx`: confirmation dialog with pet name, "Are you sure?" message, Cancel and Delete buttons (red), loading state during deletion
- [X] T099 [US5] Update pet detail page to include delete button: add "Delete Pet" button, integrate DeletePetDialog, call deletePet action on confirm

#### Testing

- [ ] T100 [P] [US5] Write integration tests for deletePet action: test successful deletion, verify pet removed from database, verify image deleted from Supabase Storage, RLS enforcement (cannot delete other user's pet), pet not found error
- [ ] T101 [P] [US5] Write component tests for DeletePetDialog: test dialog opens/closes, cancel button, delete button calls action
- [ ] T102 [US5] Write E2E test for delete pet flow: login, navigate to pet detail, click delete, see confirmation dialog, cancel (verify pet still exists), click delete again, confirm, verify redirect to /pets, verify pet removed from list

#### Integration & Verification

- [ ] T103 Test manually: delete pet with image (verify image deleted from Supabase Storage), delete pet without image, cancel deletion (verify pet persists), verify deleted pet cannot be accessed by URL, verify RLS prevents deleting other user's pet
- [ ] T104 Run all US5 tests: `pnpm test tests/integration/actions/pets` (deletePet tests) and `pnpm playwright test tests/e2e/pets`
- [ ] T105 Verify 80% coverage target met for entire project with `pnpm test --coverage`
- [ ] T106 Commit User Story 5 implementation

**Delivery Checkpoint**: Full CRUD complete. All core user stories implemented. This is a shippable product.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Add final touches, optimizations, and deployment preparation.

**Duration**: ~3-4 hours

**Dependencies**: All user stories complete

### Tasks

#### Performance & Optimization

- [ ] T107 [P] Add loading states to all forms: use useFormStatus hook, disable submit buttons during submission, show loading spinners
- [ ] T108 [P] Implement optimistic UI updates for pet list: use React useOptimistic or similar pattern for instant feedback before server confirmation
- [ ] T109 [P] Add image lazy loading in pet list: use Next.js Image component with loading="lazy", implement intersection observer for viewport-based loading
- [ ] T110 [P] Configure Next.js Image optimization in `next.config.js`: add Supabase domain to remotePatterns for image optimization
- [ ] T111 Implement pagination for pet list if needed: add page query param, Previous/Next buttons, show page X of Y

#### Error Handling & UX

- [ ] T112 [P] Create global error boundary in `app/error.tsx`: catch unhandled errors, display user-friendly message, log to console (or monitoring service)
- [ ] T113 [P] Create 404 not found page in `app/not-found.tsx`: friendly message, link back to /pets
- [ ] T114 [P] Add toast notifications for success/error messages: integrate shadcn toast component, show on create/update/delete success, show on errors
- [ ] T115 [P] Add ARIA labels and roles for accessibility: audit all interactive elements, add aria-label, aria-describedby for form errors, ensure keyboard navigation works
- [ ] T116 Verify WCAG 2.1 Level AA compliance: check color contrast (4.5:1), test with screen reader, test keyboard-only navigation

#### Documentation & Deployment

- [ ] T117 [P] Create README.md in project root: project description, setup instructions, link to quickstart.md, development commands, deployment instructions
- [ ] T118 [P] Update quickstart.md with any changes discovered during implementation
- [ ] T119 Configure Vercel project: connect GitHub repository, add environment variables from `.env.local`, configure build settings
- [ ] T120 Create GitHub Actions workflow for CI/CD in `.github/workflows/ci.yml`: run tests, lint, build, audit on PR, enforce 80% coverage, block merge on failures
- [ ] T121 Configure Dependabot for security updates in `.github/dependabot.yml`: weekly checks for npm, auto-create PRs for security patches

#### Testing & Quality Gates

- [ ] T122 [P] Write E2E test for complete user journey: register → login → create pet → view pet → edit pet → delete pet → logout
- [ ] T123 Run full test suite: `pnpm test` (all unit and integration tests), `pnpm playwright test` (all E2E tests), verify all pass
- [ ] T124 Generate and review coverage report: `pnpm test --coverage`, verify 80% coverage met, identify any gaps
- [ ] T125 Run performance audit: `pnpm build`, test production build locally, verify initial load < 3s, verify pet list < 2s for 100 pets (seed 100 pets for testing)
- [ ] T126 Run security audit: `pnpm audit`, verify no high/critical vulnerabilities, update dependencies if needed
- [ ] T127 Run ESLint with --max-warnings 0: `pnpm lint`, fix all warnings

#### Final Verification

- [ ] T128 Manual QA of all user stories: run through acceptance scenarios for US1-US5 from spec.md, verify all edge cases handled
- [ ] T129 Test on multiple browsers: Chrome, Firefox, Safari (if available), verify consistent behavior
- [ ] T130 Deploy to Vercel staging: `vercel`, verify deployment works, test in production environment
- [ ] T131 Update Supabase Auth URLs for production: add production domain to Site URL and Redirect URLs in Supabase dashboard
- [ ] T132 Final commit and deploy to production: `vercel --prod`, verify production deployment
- [ ] T133 Create release notes: summarize features implemented, known limitations, next steps

---

## Dependency Graph

### User Story Completion Order

```
US1 (Auth) ──┬──> US2 (View Pets) ──┬──> US3 (Create Pet) ──┬──> US4 (Update Pet) ──┐
             │                       │                       │                         │
             │                       │                       │                         ▼
             │                       │                       └──────────────────> US5 (Delete Pet)
             │                       │
             │                       └────────────> US3 (can also start after US1 if seeded)
             │
             └────> Any story requiring authentication
```

**Critical Path**: US1 → US2 → US3 → US4 → US5

**Parallel Opportunities**:
- US2 and US3 can be developed in parallel after US1 (if seed data exists)
- US4 and US5 are small and can be done sequentially or by different developers
- All [P] tasks within a phase can run in parallel

---

## Parallel Execution Examples

### Phase 1 (Setup) Parallelization
- **Track A**: T001 → T003 → T014 (project init, directories, gitignore)
- **Track B**: T002 → T010 → T015 (security config, TypeScript, scripts)
- **Track C**: T004 → T005 → T006 → T007 → T008 (dependencies installation)
- **Track D**: T012 → T013 (testing config)
- **Sync Point**: T016 (commit)

### Phase 3 (US1) Parallelization
- **Track A**: T033 → T035 → T036 → T037 (validation schemas → server actions)
- **Track B**: T034 → T038 → T039 (types → form components)
- **Track C**: T045 → T046 → T047 (unit tests → integration tests)
- **Track D**: T040 → T041 → T042 → T043 → T044 (pages)
- **Sync Point**: T048 (E2E test requires all above)

### Phase 5 (US3) Parallelization
- **Track A**: T071 → T073 (validation → server action)
- **Track B**: T072 → T075 (image utils → image upload component)
- **Track C**: T078 → T079 → T080 (unit tests)
- **Track D**: T076 → T077 (PetForm → page)
- **Sync Point**: T082 (E2E test requires all above)

---

## Testing Strategy

### Test Coverage Requirements

Per constitution, 80% minimum code coverage required:

- **Unit Tests** (fast, isolated):
  - All validation schemas (Zod)
  - Utility functions (image processing, error mapping)
  - Pure components (PetCard, PetDetail)

- **Integration Tests** (with real Supabase):
  - All Server Actions (auth.ts, pets.ts, upload.ts)
  - RLS policy verification
  - Database operations
  - File upload/delete flows

- **E2E Tests** (critical user journeys):
  - US1: Registration → Login → Logout
  - US2: Login → View pet list → View pet detail
  - US3: Login → Create pet with image → Verify in list
  - US4: Login → Edit pet → Verify changes
  - US5: Login → Delete pet → Verify removed
  - Complete journey: Register → Create → Edit → Delete → Logout

### Test Execution Commands

```bash
# Unit tests
pnpm test tests/unit/

# Integration tests (requires Supabase connection)
pnpm test tests/integration/

# E2E tests (requires running dev server)
pnpm playwright test

# Coverage report
pnpm test --coverage

# Watch mode for TDD
pnpm test --watch
```

---

## MVP Scope & Incremental Delivery

### MVP (Minimum Viable Product)

**User Story 1 only** - Authentication foundation:
- Users can register accounts
- Users can login
- Users can logout
- Sessions persist
- Middleware protects routes

**Estimated Time**: ~9-12 hours (Phases 1-3)

**Value**: Secure user accounts and authentication foundation for all future features.

### Increment 2: Read Operations

**US1 + US2** - View pets:
- Everything in MVP
- Users can see their pet list
- Users can view pet details
- Empty state for no pets

**Estimated Time**: +4-5 hours (Phase 4)

**Value**: Users can view their pet collection.

### Increment 3: Full CRUD

**US1 + US2 + US3** - Create pets:
- Everything in Increment 2
- Users can add new pets
- Image upload works
- Validation prevents bad data

**Estimated Time**: +5-6 hours (Phase 5)

**Value**: Core CRUD functionality (Create + Read).

### Increment 4: Update & Delete

**US1 + US2 + US3 + US4 + US5** - Full CRUD:
- Everything in Increment 3
- Users can edit pets
- Users can delete pets
- Image management (replace, remove)

**Estimated Time**: +6-8 hours (Phases 6-7)

**Value**: Complete CRUD operations. Full product.

### Production Release

**All stories + Polish**:
- Everything in Increment 4
- Optimizations (lazy loading, caching)
- Error handling (boundaries, 404)
- Accessibility (WCAG AA)
- Documentation (README)
- CI/CD (GitHub Actions)
- Deployed to Vercel

**Estimated Time**: +3-4 hours (Phase 8)

**Value**: Production-ready, polished application.

---

## Summary

**Total Tasks**: 134
- Setup: 16 tasks
- Foundational: 16 tasks
- US1 (Auth): 21 tasks
- US2 (View): 18 tasks (includes T066a for data persistence)
- US3 (Create): 14 tasks
- US4 (Update): 10 tasks
- US5 (Delete): 10 tasks
- Polish: 29 tasks

**Parallel Opportunities**: 45 tasks marked with [P] can run in parallel

**Story Labels**: All user story tasks tagged with [US1] through [US5]

**Estimated Total Time**: 27-35 hours for complete implementation

**Format Validation**: ✅ All tasks follow checklist format with T###, [P] where applicable, [US#] for story tasks, and file paths

**MVP Path**: Phases 1-3 = 30 tasks = ~9-12 hours = Shippable authentication

**Next Steps**: Begin with Phase 1 (Setup). Each task is immediately executable with the provided file paths and specifications from plan.md, data-model.md, and contracts/server-actions.md.
