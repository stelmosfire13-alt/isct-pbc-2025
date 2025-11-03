# Pet Management App - Starter Template

This is the starter template for the Programming Bootcamp Pet Management Application.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **VSCode** - [Download](https://code.visualstudio.com/)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd pet-management-starter
```

### 2. Install Dependencies

**Important:** This project includes a pre-verified `package-lock.json` file that ensures you install the exact same (and secure) versions of all packages that have been tested.

```bash
npm ci
```

**Why `npm ci` instead of `npm install`?**
- ✅ Uses exact versions from `package-lock.json`
- ✅ Faster and more reliable
- ✅ Better for educational/production environments
- ✅ Ensures everyone has the same setup

**Security Note:** The `.npmrc` file is configured to skip installation scripts (`ignore-scripts=true`) as a security precaution. This prevents potentially malicious code from running automatically during installation.

This will install all required packages including:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- Supabase client

### 3. Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   - Get your **Supabase URL** and **Anon Key** from your Supabase project dashboard
   - Get your **Database URL** from Supabase project settings → Database → Connection string

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

You should see "Hello World" displayed!

## Project Structure

```
pet-management-starter/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions
│   └── utils.ts          # Helper functions
├── public/               # Static files
├── .env.local.example    # Environment variables template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind CSS config
└── next.config.js        # Next.js config
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm audit` - Check for security vulnerabilities
- `npm outdated` - Check for outdated packages

## Security

This project includes security measures to protect against supply chain attacks:

### Pre-verified Dependencies

- `package-lock.json` is included and has been security-audited
- Always use `npm ci` instead of `npm install` to ensure exact versions
- Never delete `package-lock.json` - it's your security guarantee

### Installation Script Protection

- `.npmrc` is configured with `ignore-scripts=true`
- This prevents automatic execution of potentially malicious scripts
- If a package legitimately needs scripts, instructors will guide you

### Regular Security Checks

Run these commands periodically:

```bash
# Check for known vulnerabilities
npm audit

# See which packages are outdated
npm outdated
```

**Note:** If `npm audit` reports vulnerabilities, inform your instructor before attempting fixes.

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautifully designed components
- **Prisma** - Next-generation ORM
- **Supabase** - Open source Firebase alternative
- **Vercel** - Deployment platform

## Adding shadcn/ui Components

This project is pre-configured for shadcn/ui. To add components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# etc.
```

Components will be added to the `components/ui/` directory.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

Vercel will automatically deploy updates when you push to the main branch.

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)

## Troubleshooting

### Port 3000 already in use

```bash
# Kill the process using port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module not found errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Changes not appearing

1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear Next.js cache: `rm -rf .next`
3. Restart dev server

## Support

If you encounter issues:
1. Check the [Troubleshooting Guide](../docs/supplementary/troubleshooting.md)
2. Ask your instructor
3. Check the [Glossary](../docs/supplementary/glossary.md) for term definitions
4. Review the [Resources](../docs/supplementary/resources.md) for additional learning materials

## License

This project is for educational purposes as part of the Programming Bootcamp.

---

Happy coding! 🚀
