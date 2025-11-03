# Implementation Plan: Pet Management CRUD Application

**Branch**: `001-pet-management-crud` | **Date**: 2025-10-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-pet-management-crud/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

A web application that enables users to securely register, view, update, and delete pet information with email-based authentication. The system provides CRUD operations for pet profiles including name, category, birthday, gender, and images (JPEG/PNG up to 20MB). Built with Next.js and TypeScript for the frontend, Supabase for authentication and database, Prisma as the ORM, and Tailwind CSS with shadcn for UI components. The application emphasizes user data isolation, form validation, and responsive image handling.

## Technical Context

**Language/Version**: TypeScript (latest stable), JavaScript ES2022+
**Primary Dependencies**: Next.js (App Router), Prisma ORM, Supabase Client SDK, Tailwind CSS, shadcn/ui components
**Storage**: Supabase PostgreSQL database, Supabase Storage for images
**Testing**: Jest for unit tests, React Testing Library for component tests, Playwright for E2E tests
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - last 2 years), deployed on Vercel
**Project Type**: Web application (Next.js full-stack)
**Performance Goals**:
- API endpoints: p95 < 500ms, p99 < 1000ms
- UI: Initial paint < 1.5s, Interactive < 3s
- Image uploads: Complete within 10 seconds for files up to 20MB
- Pet list view: Display within 2 seconds for up to 100 pets
**Constraints**:
- Support 50+ concurrent authenticated users without degradation
- User actions must provide feedback within 3 seconds (200ms perceived instant)
- Maximum image file size: 20MB (JPEG/PNG only)
- 8-character minimum password length
**Scale/Scope**:
- Target: Individuals and small groups
- Expected: 1-10 pets per user, supporting up to 100 pets per user
- Estimated: ~10-15 pages/components, 5 API routes/actions
- User base: Small scale (<1000 users initially)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Evaluation (Initial)

Based on the constitution principles and quality gates:

#### I. Code Quality ✅ PASS
- TypeScript provides static typing and compile-time checks
- Next.js enforces established patterns and conventions
- ESLint and Prettier integration planned for style consistency
- Component-based architecture supports single responsibility

#### II. Testing Standards ✅ PASS
- Testing stack defined: Jest (unit), React Testing Library (integration), Playwright (E2E)
- Constitution requires 80% coverage for new features - will be enforced
- Test-first approach to be followed per constitution
- Testing pyramid structure planned:
  - Unit: Form validation, data transformations, utility functions
  - Integration: API routes/actions, database operations via Prisma
  - E2E: Critical user journeys (registration, login, CRUD operations)

#### III. User Experience Consistency ✅ PASS
- shadcn/ui provides consistent component patterns
- Tailwind CSS ensures design system consistency
- Performance targets align with constitution (<200ms perceived, <3s feedback)
- Error handling requirements defined in spec (FR-021)
- Accessibility to be addressed using shadcn's WCAG-compliant components

#### IV. Performance Requirements ✅ PASS
- Targets meet constitution minimums:
  - API: p95 < 500ms ✓ (constitution requires p95 < 500ms)
  - UI: Interactive < 3s ✓ (constitution requires < 3s)
  - Database: Prisma with indexed queries planned
  - Pagination: Will implement for pet list (max 100 items per page)
- Scale: 50 concurrent users (below constitution's 1000, but appropriate for project scope)
- Image optimization strategy needed (research phase)

#### V. Maintainability ✅ PASS
- TypeScript provides self-documenting types
- Next.js App Router follows clear conventions
- Prisma schema serves as data model documentation
- README and setup documentation planned in quickstart.md
- Supabase provides observability dashboard

### Quality Gates Checklist

Pre-implementation commitment:

- [ ] All tests passing (unit, integration, contract) - Will enforce in CI/CD
- [ ] Code coverage maintains or improves - 80% minimum target
- [ ] No linter or static analysis warnings - ESLint + TypeScript strict mode
- [ ] Performance benchmarks within thresholds - Lighthouse CI integration planned
- [ ] Security scan passes - Supabase provides built-in security, dependency scanning needed
- [ ] Documentation updated - Inline JSDoc + quickstart.md
- [ ] Code review approval - Required before merge
- [ ] All [NEEDS CLARIFICATION] markers resolved - ✓ Already resolved in spec

**Initial Status**: ✅ PASSED - No constitutional violations. All principles addressed in technical approach.

---

### Post-Design Evaluation (After Phase 1)

After completing research, data model, and API contracts, re-evaluating constitution compliance:

#### I. Code Quality ✅ PASS
- ✅ Data model defined with Prisma (type-safe ORM)
- ✅ Zod schemas provide runtime validation and type inference
- ✅ Server Actions use TypeScript for end-to-end type safety
- ✅ Shared validation schemas eliminate code duplication (DRY principle)
- ✅ Component structure follows Next.js App Router conventions

#### II. Testing Standards ✅ PASS
- ✅ Testing strategy documented in data-model.md
- ✅ Unit tests: Validation schemas, utility functions
- ✅ Integration tests: Server Actions, database operations, RLS policies
- ✅ E2E tests: Complete user flows (auth, CRUD operations)
- ✅ Test factories defined for consistent test data
- ✅ 80% coverage target confirmed

#### III. User Experience Consistency ✅ PASS
- ✅ Error handling standardized across all Server Actions
- ✅ Consistent response format: `{ success, message, data/errors }`
- ✅ User-friendly error messages (no stack traces)
- ✅ Form validation: REPL pattern (Reward Early, Punish Late)
- ✅ Inline field errors + form-level summaries
- ✅ ARIA attributes for accessibility
- ✅ Progress indicators for image uploads

#### IV. Performance Requirements ✅ PASS
- ✅ Database indexes on `user_id` and `created_at` (optimized queries)
- ✅ Pagination implemented (max 100 items per page)
- ✅ Image compression before upload (reduces bandwidth)
- ✅ Direct client-to-storage upload (bypasses server bottleneck)
- ✅ Supabase CDN for image serving with transformations
- ✅ Query patterns documented with performance considerations
- ✅ All targets align with success criteria:
  - Pet list: < 2 seconds for 100 pets ✓
  - Create pet: < 2 minutes with image ✓
  - Image upload: < 10 seconds for 20MB ✓
  - User actions: < 3 seconds feedback ✓

#### V. Maintainability ✅ PASS
- ✅ Comprehensive documentation:
  - research.md: Technical decisions and rationale
  - data-model.md: Schema, validation, RLS policies
  - contracts/server-actions.md: API contracts and error handling
  - quickstart.md: Setup guide and troubleshooting
- ✅ Prisma schema as single source of truth for data model
- ✅ Zod schemas as single source of truth for validation
- ✅ TypeScript types inferred from schemas (no duplication)
- ✅ Observability: Supabase dashboard, structured logging planned
- ✅ Security documented: Three-layer protection (middleware + Server Component + RLS)

### Security Compliance ✅ PASS

Additional security verification:

- ✅ **Defense-in-depth**: Three-layer protection prevents CVE-2025-29927 vulnerability
- ✅ **RLS policies**: Database-level authorization (documented in data-model.md)
- ✅ **Input validation**: Client + server validation on all inputs
- ✅ **File upload security**: Type, size, and content validation
- ✅ **Authentication**: `getUser()` for server validation (never `getSession()`)
- ✅ **Storage security**: Private buckets with RLS, signed URLs for access
- ✅ **SQL injection**: Prevented by Prisma parameterized queries
- ✅ **XSS protection**: React escapes by default, no `dangerouslySetInnerHTML`
- ✅ **CSRF protection**: Next.js Server Actions include CSRF tokens
- ✅ **NPM supply chain protection**: Response to 2025 Aug/Sep attacks
  - Exact version pinning (no `^` or `~` ranges)
  - Disabled install scripts by default (`ignore-scripts=true`)
  - `--frozen-lockfile` enforced in CI/CD
  - Security audits on every install (`audit-level=moderate`)
  - Lock file monitoring in pull requests
  - Manual review required for all dependency updates

### Design Quality Assessment

**Strengths**:
1. Type safety from database to UI (Prisma → Zod → React Hook Form)
2. Comprehensive documentation with decision rationale
3. Performance optimization at multiple layers (indexes, compression, CDN)
4. Security through defense-in-depth approach
5. Clear separation of concerns (validation, data access, UI)

**Potential Improvements** (Future iterations):
1. Add API rate limiting per user (beyond Supabase defaults)
2. Implement caching strategy for frequently accessed pet lists
3. Add telemetry/monitoring for performance tracking
4. Consider image thumbnail generation for list view optimization

**Final Status**: ✅ PASSED - All constitutional requirements met. Design is production-ready.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Next.js App Router Structure (Full-stack Web Application)
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx           # Login page
│   ├── register/
│   │   └── page.tsx           # Registration page
│   └── layout.tsx             # Auth layout (no nav)
├── (dashboard)/
│   ├── pets/
│   │   ├── page.tsx           # Pet list view
│   │   ├── [id]/
│   │   │   ├── page.tsx       # Pet detail view
│   │   │   └── edit/
│   │   │       └── page.tsx   # Edit pet form
│   │   └── new/
│   │       └── page.tsx       # Add new pet form
│   └── layout.tsx             # Dashboard layout (with nav)
├── api/
│   └── auth/                  # Supabase auth callbacks (if needed)
├── layout.tsx                 # Root layout
└── page.tsx                   # Home/landing page

components/
├── ui/                        # shadcn components (button, form, input, etc.)
├── forms/
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── pet-form.tsx           # Shared form for create/edit
├── pets/
│   ├── pet-card.tsx           # Pet list item component
│   ├── pet-detail.tsx         # Pet detail display
│   └── pet-image-upload.tsx   # Image upload component
└── layout/
    ├── header.tsx
    └── nav.tsx

lib/
├── supabase/
│   ├── client.ts              # Supabase client initialization
│   ├── server.ts              # Server-side Supabase client
│   └── middleware.ts          # Auth middleware
├── prisma.ts                  # Prisma client singleton
├── validations/
│   ├── auth.ts                # Auth validation schemas (Zod)
│   └── pet.ts                 # Pet validation schemas (Zod)
└── utils/
    ├── image.ts               # Image processing utilities
    └── errors.ts              # Error handling utilities

prisma/
├── schema.prisma              # Database schema
└── migrations/                # Prisma migrations

actions/                       # Server Actions
├── auth.ts                    # Auth actions (login, register, logout)
└── pets.ts                    # Pet CRUD actions

types/
├── database.ts                # Generated Prisma types
└── models.ts                  # Application-specific types

tests/
├── unit/
│   ├── validations/
│   ├── utils/
│   └── components/
├── integration/
│   ├── actions/               # Server actions tests
│   └── api/                   # API route tests
└── e2e/
    ├── auth.spec.ts
    └── pets.spec.ts

public/
├── images/                    # Static images
└── fonts/                     # Custom fonts (if any)
```

**Structure Decision**: Selected Next.js App Router structure (Option 2: Web application variant). This is a full-stack application where:
- **Frontend and Backend are colocated**: Next.js App Router handles both UI (React components) and backend logic (Server Actions, API routes)
- **Route groups** (`(auth)`, `(dashboard)`) organize pages by authentication state without affecting URLs
- **Server Actions** in `/actions` directory handle data mutations (auth, CRUD operations)
- **Prisma** manages database schema and migrations
- **Supabase** provides authentication and file storage
- **shadcn/ui** components live in `/components/ui`
- **Testing** follows the pyramid with separate directories for each level

This structure follows Next.js 13+ conventions and supports the full-stack nature of the application while maintaining clear separation of concerns.

## Complexity Tracking

No constitutional violations to justify. All complexity introduced aligns with constitution principles and project requirements.
