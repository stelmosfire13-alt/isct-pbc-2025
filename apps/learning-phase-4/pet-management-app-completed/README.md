# Pet Management App

A full-stack web application for managing your pets, built with Next.js, TypeScript, Prisma, and Supabase.

## Features

- User authentication (Sign up / Log in / Log out)
- CRUD operations for pets
- Image upload for pet photos
- Responsive UI with Tailwind CSS and shadcn-ui
- PostgreSQL database with Prisma ORM
- Supabase for authentication and storage

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn-ui
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Authentication & Storage**: Supabase
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)
- A Vercel account (optional, for deployment)

## Setup Instructions

### 1. Install Dependencies

```bash
cd pet-management-app
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com/) and create a new project
2. Wait for the database to be provisioned (this takes a few minutes)
3. Go to **Settings** → **API** in your Supabase dashboard
4. Copy the following values:
   - Project URL
   - `anon` public key
   - `service_role` key (keep this secret!)

5. Go to **Settings** → **Database** and copy the connection string
   - It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

### 3. Set Up Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Create a new bucket called `pet-images`
3. Make it **Public** so uploaded images are accessible
4. Set the following policies:
   - Allow authenticated users to upload
   - Allow public to read

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in the values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Set Up Database with Prisma

Generate Prisma client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

This will create the `Pet` table in your Supabase database.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The app uses a single `Pet` model:

```prisma
model Pet {
  id        String   @id @default(uuid())
  ownerId   String
  name      String
  category  String
  breed     String?
  birthday  DateTime?
  gender    String?
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Routes

### Authentication
- `POST /api/auth/signup` - Create a new user
- `POST /api/auth/login` - Log in a user
- `POST /api/auth/logout` - Log out a user

### Pets
- `GET /api/pets` - Get all pets for current user
- `POST /api/pets` - Create a new pet
- `GET /api/pets/[id]` - Get a specific pet
- `PUT /api/pets/[id]` - Update a specific pet
- `DELETE /api/pets/[id]` - Delete a specific pet
- `POST /api/pets/upload` - Upload a pet image

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com/) and sign in with GitHub
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `apps/learning-phase-4/pet-management-app` (if in monorepo)
5. Add environment variables:
   - Add all variables from `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel domain
6. Click **Deploy**

### 3. Run Database Migrations on Production

After deploying, you need to run migrations against your production database:

```bash
npx prisma migrate deploy
```

## Project Structure

```
pet-management-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── api/
│   │   ├── auth/
│   │   └── pets/
│   ├── my-pets/
│   │   ├── [id]/
│   │   │   ├── edit/
│   │   │   └── page.tsx
│   │   ├── new/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   └── layout/
├── lib/
│   ├── supabase.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local
├── .env.example
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Log In**: Log in with your credentials
3. **Add Pet**: Click "Add New Pet" to register a new pet
4. **View Pets**: See all your pets in the "My Pets" page
5. **Edit Pet**: Click on a pet card to view details, then click "Edit"
6. **Delete Pet**: From the pet detail page, click "Delete" and confirm

## Troubleshooting

### Database Connection Issues

- Make sure your `DATABASE_URL` is correct
- Check if your Supabase project is active
- Verify your IP is not blocked in Supabase settings

### Image Upload Issues

- Verify the `pet-images` bucket exists in Supabase Storage
- Check bucket permissions (should be public)
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

### Authentication Issues

- Clear browser localStorage and cookies
- Check Supabase Auth settings
- Verify environment variables are set correctly

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## License

MIT

## Author

Created for Programming Boot Camp at Institute of SCIENCE TOKYO
