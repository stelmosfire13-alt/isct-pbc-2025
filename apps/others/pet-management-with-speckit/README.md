# Pet Management CRUD Application

A complete Next.js 14 application demonstrating modern full-stack development with authentication, database integration, and file uploads.

## 📚 Learning Objectives

This application is part of the **PBC (Programming Boot Camp) 2025 - Learning Phase 2** curriculum. Students will learn:

- **Next.js 14 App Router** - Modern React framework with server components
- **Authentication** - User registration and login with Supabase Auth
- **Database Operations** - CRUD operations with Prisma ORM and PostgreSQL
- **File Uploads** - Image handling with Supabase Storage
- **Form Handling** - React Hook Form with Zod validation
- **Server Actions** - Type-safe server-side mutations
- **Row Level Security (RLS)** - Database-level authorization
- **Modern UI** - Tailwind CSS with shadcn/ui components

## 🎯 Features

### User Stories Implemented

1. **US1: Authentication** (Priority 1)
   - User registration with email/password
   - User login with session management
   - Protected routes with middleware

2. **US2: View Pets** (Priority 2)
   - Display list of user's pets
   - View detailed pet information
   - Empty state for new users

3. **US3: Create Pet** (Priority 3)
   - Add new pet with form validation
   - Upload and compress pet images
   - Automatic image optimization

4. **US4: Update Pet** (Priority 4)
   - Edit existing pet information
   - Replace or remove pet images
   - Pre-populated forms

5. **US5: Delete Pet** (Priority 5)
   - Delete pets with confirmation
   - Automatic cleanup of associated images

## 🛠️ Tech Stack

### Frontend
- **Next.js 14.2.32** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.6.3** - Type safety
- **Tailwind CSS 3.4.13** - Utility-first CSS
- **shadcn/ui** - Component library
- **React Hook Form 7.53.0** - Form management
- **Zod 3.23.8** - Schema validation

### Backend
- **Next.js Server Actions** - Server-side mutations
- **Prisma 5.20.0** - Type-safe ORM
- **Supabase Auth** - Authentication provider
- **Supabase Storage** - File storage
- **PostgreSQL** - Relational database

### Development Tools
- **ESLint** - Code linting
- **Playwright** - E2E testing
- **Jest** - Unit testing
- **pnpm** - Fast package manager

## 📋 Prerequisites

Before starting, ensure you have:

- Node.js 20.x or later
- pnpm 8.x or later
- A Supabase account (free tier available)
- Git

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd /Users/kim/development/isct-pbc-2025/apps/learning-phase-2
pnpm install --ignore-scripts
```

### 2. Environment Setup

Copy the environment template:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.xxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR_PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

### 3. Database Setup

Run Prisma migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Run the SQL scripts for RLS policies:

```bash
# In Supabase SQL Editor, run:
# - prisma/sql-scripts/database-rls-policies.sql
# - prisma/sql-scripts/storage-rls-policies.sql
```

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Project Structure

```
learning-phase-2/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected routes
│   │   └── pets/            # Pet management pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── actions/                  # Server Actions
│   ├── auth.ts              # Authentication actions
│   └── pets.ts              # Pet CRUD actions
├── components/               # React components
│   ├── forms/               # Form components
│   ├── layout/              # Layout components
│   ├── pets/                # Pet-specific components
│   └── ui/                  # shadcn/ui components
├── lib/                      # Utilities and configurations
│   ├── supabase/            # Supabase clients
│   ├── utils/               # Utility functions
│   └── validations/         # Zod schemas
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma        # Prisma schema
│   ├── migrations/          # Migration files
│   └── sql-scripts/         # RLS policies
├── specs/                    # Project documentation
│   └── 001-pet-management-crud/
│       ├── spec.md          # Feature specification
│       ├── plan.md          # Technical plan
│       ├── tasks.md         # Implementation tasks
│       ├── data-model.md    # Database design
│       └── contracts/       # API contracts
└── middleware.ts             # Route protection
```

## 🔐 Security Features

### Authentication
- Password validation (minimum 8 characters)
- Session-based authentication with Supabase
- Protected routes with Next.js middleware
- Secure password hashing (managed by Supabase)

### Authorization
- Row Level Security (RLS) policies
- User can only access their own pets
- Foreign key constraints with CASCADE delete
- Server-side authorization checks

### Data Validation
- Client-side validation with Zod schemas
- Server-side validation in Server Actions
- Type-safe database queries with Prisma
- SQL injection prevention via ORM

## 📝 Key Learning Concepts

### 1. Next.js App Router

The application uses Next.js 14's App Router with:
- **Server Components** - Default for data fetching
- **Client Components** - For interactivity (`'use client'`)
- **Server Actions** - Type-safe server mutations
- **Route Groups** - `(auth)` and `(dashboard)` for layouts

### 2. Form Handling Pattern

```typescript
// components/forms/pet-form.tsx
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<PetInput>({
  resolver: zodResolver(petSchema),
})

const [state, formAction] = useFormState(createPet, null)
```

### 3. Server Actions

```typescript
// actions/pets.ts
export async function createPet(
  prevState: PetActionState | null,
  formData: FormData
): Promise<PetActionState> {
  // 1. Verify authentication
  // 2. Validate data
  // 3. Handle image upload
  // 4. Create database record
  // 5. Revalidate cache
  // 6. Redirect (outside try-catch!)
}
```

### 4. RLS Policies

```sql
-- Users can only see their own pets
CREATE POLICY "Users can view own pets"
ON pets FOR SELECT
USING (auth.uid() = user_id);
```

## 🧪 Testing

### Run Unit Tests
```bash
pnpm test
```

### Run E2E Tests
```bash
pnpm playwright test
```

### View Test Coverage
```bash
pnpm test --coverage
```

## 🎓 Learning Exercises

### Beginner Level
1. Add a new field to the Pet model (e.g., `breed`)
2. Create a filter to show only dogs or cats
3. Add pagination to the pet list
4. Implement a search feature

### Intermediate Level
1. Add pet vaccination records (one-to-many relationship)
2. Implement pet sharing between users
3. Add image cropping before upload
4. Create a dashboard with statistics

### Advanced Level
1. Add real-time updates using Supabase Realtime
2. Implement optimistic UI updates
3. Add comprehensive test coverage
4. Deploy to Vercel with CI/CD

## 📚 Documentation

For detailed documentation, see the `specs/001-pet-management-crud/` directory:

- **spec.md** - Feature specification and user stories
- **plan.md** - Technical architecture and design decisions
- **tasks.md** - Implementation task breakdown
- **data-model.md** - Database schema and relationships
- **contracts/** - API contracts and test requirements
- **quickstart.md** - Setup and development guide

## 🐛 Common Issues

### Database Connection Failed
- Check your `DATABASE_URL` in `.env.local`
- Ensure your IP is allowed in Supabase dashboard
- Verify port 5432 is not blocked by firewall

### Images Not Displaying
- Check Storage RLS policies are applied
- Verify the `pet-images` bucket is public
- Check `NEXT_PUBLIC_SUPABASE_URL` is set correctly

### Authentication Errors
- Clear browser cookies and try again
- Check Supabase Auth is enabled
- Verify environment variables are loaded

## 🤝 Contributing

This is a learning project. Students are encouraged to:
1. Fork the repository
2. Experiment with new features
3. Share improvements with classmates
4. Document your learning journey

## 📄 License

This project is created for educational purposes as part of PBC 2025.

## 🙏 Acknowledgments

- Built with Next.js 14 and Supabase
- UI components from shadcn/ui
- Part of the ISCT Programming Boot Camp 2025 curriculum

---

**Happy Learning! 🚀**

For questions or support, please refer to the course materials or ask your instructor.
