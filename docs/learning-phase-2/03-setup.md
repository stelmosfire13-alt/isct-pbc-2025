# Section 3: Setup - Development Environment & Account Setup

## 3.1 Objectives

- Install all necessary development tools
- Create accounts for cloud services
- Clone the starter project
- Verify local development works
- Deploy to production and verify

## 3.2 Overview

By the end of this section, you will have:

- ✅ VSCode installed and configured
- ✅ Node.js installed and verified
- ✅ Git installed and configured
- ✅ GitHub account created
- ✅ Vercel account with GitHub integration
- ✅ Supabase project created
- ✅ Starter project running locally
- ✅ Application deployed to production

---

## 3.3 Install VSCode

**Visual Studio Code** is your code editor where you'll write all your code.

### Windows

1. Visit https://code.visualstudio.com/
2. Click "Download for Windows"
3. Run the downloaded installer (`VSCodeSetup.exe`)
4. Follow the installation wizard:
   - ✅ Accept the license agreement
   - ✅ Check "Add to PATH"
   - ✅ Check "Create desktop icon"
   - ✅ Check "Register Code as an editor for supported file types"
5. Click "Next"
5. Click "Install"
6. Launch VSCode

### Mac

1. Visit https://code.visualstudio.com/
2. Click "Download for Mac"
3. Open the downloaded `.dmg` file
4. Drag VSCode to the Applications folder
5. Open VSCode from Applications

### Verify Installation

1. Open VSCode
2. You should see the welcome screen
3. Close VSCode for now

---

## 3.4 Install Node.js

**Node.js** is required to run JavaScript locally and use development tools.

### Check if Already Installed

**Open VSCode Terminal:**

1. Open Visual Studio Code
2. Open the integrated terminal: Terminal → New Terminal (or Ctrl/Cmd + `)
3. Run:

```bash
node --version
```

If you see `v18.0.0` or higher, **Node.js is already installed**. Skip to Step 3 (Install Git).

If you see an error like "command not found", continue with installation below.

### Windows Installation

1. Visit https://nodejs.org/
2. Click **"Get Node.js"** button to go to download page
3. Select **"Windows Installer (.msi)"** (green button)
   ![](images/2025-11-02-18-42-47.png)
   - ✅ This is the easiest option for beginners
   - ❌ Avoid "Docker" or "Standalone Binary" options
4. Download the `.msi` file
5. Double-click the downloaded file to run the installer
6. Follow the installation wizard:
   - Accept license
   - Use default installation path
   - ✅ Ensure "Add to PATH" is selected (Default) 

7. **Important:** You may see "Tools for Native Modules" screen:

   ![](images/2025-11-02-18-46-22.png)

   **⚠️ Leave this checkbox UNCHECKED**

   - These tools are not needed for this course
   - They take significant time (10-30 minutes) and disk space (several GB) to install
   - You can install them later if needed
   - Click **"Next"** to continue

8. Click "Install" and wait for installation to complete
9. Restart your terminal after installation completes



### Mac Installation

1. Visit https://nodejs.org/
2. Click **"Get Node.js"** button to go to download page
3. Select **"macOS インストーラー (.pkg)"** (green button)
   ![](images/2025-11-02-18-55-09.png)
   - ✅ This is the easiest option for beginners
   - ❌ Avoid "nvm" or "スタンドアローンのバイナリー" options
4. Download the `.pkg` file
5. Double-click the downloaded file to open installer
6. Follow the installation wizard

### Verify Installation

**Open VSCode Terminal (Windows & Mac):**

1. Open Visual Studio Code
2. Open the integrated terminal:
   - **Menu:** Terminal → New Terminal
3. Run the following commands:

**Check Node.js:**
```bash
node --version
```

You should see something like:
```
v24.11.0
```

**Check npm (Node Package Manager):**
```bash
npm --version
```

You should see something like:
```
11.6.1
```

✅ If you see version numbers for both, Node.js is successfully installed!

![](images/2025-11-03-09-14-04.png)

#### ⚠️ Common Errors and Fixes

**Error 1: "node is not recognized" (Windows/Mac)**

If you see this error:
```
node : The term 'node' is not recognized as the name of a cmdlet, function, script file, or operable program.
```
or
```
command not found: node
```

**Solution:**

1. **Close VSCode completely** (File → Exit or Alt+F4)
2. **Reopen VSCode**
3. Open a new terminal and try again

**Why:** VSCode needs to be restarted to load the updated PATH after Node.js installation.

---

**Error 2: npm scripts error (Windows PowerShell)**

If you see this error on Windows:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because
running scripts is disabled on this system.
```

**Solution:**

1. Close VSCode
2. Open **PowerShell as Administrator:**
   - Press Windows key
   - Type "PowerShell"
   - Right-click "Windows PowerShell"
   - Select **"Run as administrator"**
3. Run this command:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
4. When asked "Do you want to change the execution policy?", type **Y** and press Enter
5. Close PowerShell
6. Reopen VSCode and try `npm --version` again

This allows npm scripts to run on your system.

---

## 3.5 Install Git

**Git** is version control software that tracks your code changes.

### Check if Already Installed

**Open VSCode Terminal:**

1. Open Visual Studio Code
2. Open the integrated terminal: Terminal → New Terminal (or Ctrl/Cmd + `)
3. Run:

```bash
git --version
```

If you see `git version 2.x.x`, **Git is already installed**. Skip to "Configure Git" below.

If you see an error like "command not found", continue with installation below.

### Windows Installation

1. Visit https://git-scm.com/download/win
2. Click **"Click here to download"** button
3. Wait for the download to complete (the file will be named `Git-2.x.x-64-bit.exe`)
4. Double-click the downloaded file to run the installer
5. Follow the installation wizard:
   - Click **"Next"** on each screen
   - ✅ Use default settings (recommended for beginners)
   - No need to change any options
6. Click **"Install"** and wait for completion
7. Click **"Finish"**
8. **Restart your terminal** (important!)

### Mac Installation

1. Open Terminal application
2. Run this command:
   ```bash
   git --version
   ```
3. If Git is not installed, a popup window will appear asking:
   **"Install command line developer tools?"**
4. Click **"Install"** button in the popup
5. Accept the license agreement
6. Wait for installation to complete (may take several minutes)
7. The popup will say **"The software was installed"** when done

**Note:** If you see a version number instead of the popup, Git is already installed.

### Verify Installation

**Open VSCode Terminal (Windows & Mac):**

1. Open Visual Studio Code (if not already open)
2. Open the integrated terminal:
   - **Menu:** Terminal → New Terminal
   - **Shortcut (Windows):** Ctrl + `
   - **Shortcut (Mac):** Cmd + `
3. Run the following command:

```bash
git --version
```

You should see something like:
```
git version 2.39.3 (Apple Git-146)
```
or
```
git version 2.51.2.windows.1
```

✅ If you see a version number, Git is successfully installed!

### Configure Git

Now let's tell Git who you are. This information will be attached to your commits.

**Important:** You'll use your GitHub username and email address in the next step (Section 4). If you already have a GitHub account, use those credentials now. If not, remember what you enter here and use the same information when creating your GitHub account.

1. Set your name (use your GitHub username):
```bash
git config --global user.name "Your GitHub Username"
```

Replace `"Your GitHub Username"` with your actual GitHub username (e.g., `"taro-yamada"`).

2. Set your email (use your GitHub email):
```bash
git config --global user.email "your-github-email@example.com"
```

Replace `"your-github-email@example.com"` with the email address you use (or will use) for GitHub.

**Critical:** The email address here MUST match your GitHub account email.

3. Verify your configuration:
```bash
git config --global --list
```

You should see:
```
user.name=Your Name
user.email=your.email@example.com
```

✅ Git is now configured!

---

## 3.6 Create GitHub Account

**GitHub** hosts your code online and integrates with deployment.

### Steps

1. Visit https://github.com/
2. Click "Sign up"
3. Enter your email address
4. Create a password
5. Choose a username (lowercase, no spaces)
6. Click "Create account"
7. Check your email for verification code
8. Enter the verification code
9. Answer the onboarding questions (or skip)

**Keep GitHub open in your browser - you'll need it soon.**

## 3.7 Complete Picture for now

**What you've accomplished so far:**

At this point, you have set up everything needed for **local development**:

✅ **VSCode** - Your code editor
✅ **Node.js** - JavaScript runtime for development
✅ **Git** - Version control system
✅ **GitHub Account** - Code hosting and collaboration platform

![](images/2025-11-03-10-43-05.png)

**You can now develop applications on your local computer!**

**What's next:**

However, to **share your application on the internet**, you need additional tools:

🌐 **Vercel** - Deploys your app to the internet (makes it accessible via URL)
🗄️ **Supabase** - Provides database for storing data online

These are the tools we'll set up next, so your application can be accessed by anyone, anywhere.

---

## 3.8 Create Vercel Account

**Vercel** will host your deployed application on the internet.

### Steps

1. Visit https://vercel.com/
2. Click "Sign Up"
3. Select "Hobby" (free plan) and fill in your account name
4. **Important:** Click "Continue with GitHub"
5. Authorize Vercel to access your GitHub account

### Why Link to GitHub?

- Automatic deployments when you push code
- Preview deployments for branches
- Easy collaboration
- Industry-standard workflow

**Keep Vercel open in a browser tab.**

---

## 3.9 Create Supabase Project

**Supabase** is your database where pet data will be stored.

### Steps

1. Visit https://supabase.com/
2. Click "Start your project"
3. Click "Continue with Github"
4. Authorize Supabase (allow GitHub access)
5. **Create organization:**
   - **Name:** Enter any name (e.g., your username or "my-projects")
   - **Type:** Select **"Personal"**
   - **Plan:** Keep **"Free - $0/month"** (already selected)
   - Click **"Create organization"** button
6. Click "New project"
7. Fill in the details:
   - **Name**: `pet-management` (or your choice)
   - **Database Password**: Create a strong password
     - **Important:** Save this password! You'll need it later
     - Store it in a text file or password manager
   - **Region**: "APAC" (Deafault)
8. Click "Create new project"

**Keep Supabase open in a browser tab.**

---

## 3.10 All Set! Your Development Environment is Ready

**Congratulations! You've completed all the preparation steps.**

You now have everything needed to develop and deploy web applications:

### ✅ What You've Set Up

**Local Development:**
- ✅ **VSCode** - Your code editor
- ✅ **Node.js** - JavaScript runtime
- ✅ **Git** - Version control
- ✅ **GitHub Account** - Code hosting and collaboration

**Deployment & Database:**
- ✅ **Vercel** - Deploys your app to the internet
- ✅ **Supabase** - Database for storing data online

![](images/2025-11-03-11-24-19.png)

**Next:** Let's get the starter project code and start building!

---

## 3.11 Fork and Clone the Starter Project

Now let's get your own copy of the starter code.

### Fork the Repository on GitHub

**Forking creates your own copy of the repository on GitHub.**

1. Go to the course repository:
   ```
   https://github.com/GuildWorks/isct-pbc-2025
   ```

2. Click the **"Fork"** button in the top-right corner
   - This creates a copy under your GitHub account
     ![](images/2025-11-03-11-42-07.png)

3. You'll see a page saying "Create a new fork"
   - **Owner:** Your username (should be selected)
   - **Repository name:** `isct-pbc-2025` (keep as is)
   - **Description:** (optional)
   - **Copy the main branch only:** ✅ Keep this checked

4. Click **"Create fork"**

5. GitHub will create your fork and redirect you to:
   ```
   https://github.com/YOUR_USERNAME/isct-pbc-2025
   ```

**Now you have your own copy that you can modify!**

### Clone Your Forked Repository

1. On your forked repository page, click the green **"Code"** button

2. Copy the HTTPS URL (should look like):
   ```
   https://github.com/YOUR_USERNAME/isct-pbc-2025.git
   ```

3. Open VSCode terminal

4. Clone your forked repository:
```bash
git clone https://github.com/YOUR_USERNAME/isct-pbc-2025.git
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

This will download your fork to your computer.

5. Open the cloned folder on VSCode
![](images/2025-11-03-11-46-36.png)

6. Select "Yes, I trust the authors"
![](images/2025-11-03-11-48-30.png)

**Note:** This is the course's organized structure:
- `isct-pbc-2025` - Main repository
- `apps/learning-phase-2` - This today's starter app

### Project Structure

You should see something like this in VSCode:

```
pet-management-starter/
├── app/
│   ├── page.tsx          # Main homepage
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
├── lib/                  # Utility functions
├── public/               # Static files
├── node_modules/         # Dependencies (after npm install)
├── .env.local.example    # Environment variables template
├── package.json          # Project dependencies
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── README.md             # Project documentation
```

---

## 3.12 Install Dependencies

Projects depend on external libraries. Let's install them.

### Navigate to the Project Directory

First, make sure you're in the correct directory where the starter app is located.

1. Open VSCode terminal (if not already open):
   - **Menu:** Terminal → New Terminal

2. Navigate to the project directory:
```bash
cd apps/learning-phase-2
```

3. Verify you're in the correct directory:
```bash
pwd
```

You should see a path ending with `/apps/learning-phase-2` (Mac) or `\apps\learning-phase-2` (Windows).

4. List the files to confirm:
```bash
ls
```

You should see files like:
- `package.json`
- `next.config.js`
- `app/` directory
- etc.

### Install the Dependencies

Now let's install all the libraries this project needs.

**Run this command:**

```bash
npm ci
```

**This will take 2-5 minutes.**

You'll see output like:
```
added 312 packages, and audited 313 packages in 45s
```

### About `npm ci`

**Why `npm ci` instead of `npm install`?**

- `npm ci` uses exact, pre-tested versions
- Everyone gets the same packages (easier troubleshooting)
- It's faster and more reliable

**Note:** You might see some yellow warning messages - these are safe to ignore. The packages work correctly despite the warnings.

---

## 3.13 Configure Environment Variables

Your app needs to know how to connect to Supabase.

### Create .env.local File

1. In VSCode, find `.env.local.example` in the file explorer
2. Right-click on it → Copy and Paste
   ![](images/2025-11-03-13-44-37.png)
3. Rename the copy to `.env.local`


### Add Your Supabase Credentials

1. Open `.env.local` in VSCode
2. You should see:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=your-database-url
```

3. Go back to your Supabase project tab in browser

#### Get Project URL and API Key

4. Go to **Project Settings** (gear icon in sidebar)
   ![](images/2025-11-03-11-19-08.png)
5. Go to **Data API** section
6. Find and copy this value:
   - **Project URL** (looks like `https://xyz.supabase.co`)
7. Paste it in `.env.local` after `NEXT_PUBLIC_SUPABASE_URL=`
8. Go to **API Keys** section
9. Find and copy this value:
   - **Project API key** (anon public key looks like `eyJhbGciOiJIU.....` )
10. Paste it after `NEXT_PUBLIC_SUPABASE_ANON_KEY=`

#### Get Database Connection String

11. Go to **Project Settings** → **Database** → **Connect** to confirm **Connection string**
    ![](images/2025-11-03-14-41-53.png)
12. Check to **Connection string** section
13. **Important:** Make sure **"Session Pooler"** mode is selected (not "Transaction" or "Direct")
    - Session Pooler is required for Prisma to work correctly
    ![](images/2025-11-03-14-55-32.png)
14. Copy the connection string
    - It should look like: `postgresql://postgres.xxxxx:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true`
    - **Check:** The URL contains `.pooler.supabase.com` and port `:5432`
    ![](images/2025-11-03-14-56-22.png)
15. **Important:** Replace `[YOUR-PASSWORD]` in the copied string with your actual database password (the one you saved when creating the project)
16. Paste the complete connection string in `.env.local` after `DATABASE_URL=`

**Final result should look like:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres.abcdefghijk:yourpassword@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true
```

18. Save the file (Ctrl+S / Cmd+S)

### Verify Database Connection

1. Right-click `.env.local` → Copy
2. Right-click in the file explorer → Paste
3. Rename to `.env`

**Note:** Both `.env` and `.env.local` are in `.gitignore`, so they won't be committed to Git.

Let's test if the database connection is configured correctly.

4. In your terminal, run:
```bash
npx prisma db pull
```

5. If successful, you should see this error message (which is actually good!):

```
Environment variables loaded from .env
Datasource "db": PostgreSQL database "postgres"

✖ Introspecting based on datasource defined in prisma\schema.prisma
Error: P4001 The introspected database was empty
```

**This is expected!** It means:
- ✅ DATABASE_URL is correct
- ✅ Password is correct
- ✅ Prisma successfully connected to your Supabase database
- ✅ The database is empty (no tables yet) - this is normal for a new project

**Don't worry about this "error"** - you'll create tables later in the course.

#### If you see an error:

**Error: "Can't reach database server"**
- **Most common cause:** Wrong connection mode selected in Supabase
  - Go back to Supabase → Project Settings → Database → Connection string
  - Make sure **"Session Pooler"** mode is selected (not "Direct" or "Transaction")
  - The URL should contain `.pooler.supabase.com` and port `:5432`
- Check that DATABASE_URL is copied correctly
- Make sure there are no extra spaces
- Verify your internet connection

**Error: "Authentication failed"**
- The password in DATABASE_URL is incorrect
- Go back to your saved password and replace `[YOUR-PASSWORD]` again
- Make sure you're using the database password, not your Supabase account password

**Error: "Invalid connection string"**
- Check the format of DATABASE_URL
- It should start with `postgresql://`
- Make sure you selected the **URI** tab in Supabase

**Error: "Environment variable not found: DATABASE_URL"**
- Make sure you created the `.env` file (not just `.env.local`)
- Restart your terminal and try again
- Double-check the file is named exactly `.env` (not `.env.txt`)

**Error: "prepared statement 's1' already exists"**
- You're using Transaction mode instead of Session mode
- Go back to Supabase and select **"Session Pooler"** mode
- Copy the new connection string and update your `.env` and `.env.local`

If the connection test passes, you're ready to continue!

---

## 3.14 Run the Development Server

Time to see your app running locally!

### Start the Server

In your terminal:

```bash
npm run dev
```

You should see:
```
> pet-management-starter@0.1.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.100:3000

 ✓ Ready in 2.5s
```

### Open in Browser

1. Open your web browser
2. Go to http://localhost:3000
3. You should see: **"Hello World"** or a welcome message

**If you see this, congratulations! Your local development environment is working!**

### What's Happening?

- Next.js development server is running on your local device
- Watching for file changes
- Automatically recompiling when you edit code
- Hot reloading (updates browser automatically)

### Test Hot Reload

1. In VSCode, open `app/page.tsx`
2. Find the text "Hello World"
3. Change it to "Hello Pet Management App!"
4. Save the file
5. Look at your browser - it should update automatically!

**This is hot reloading in action.**

**Note:** This change is only on your local computer. Keep this browser tab open - we'll come back to it after setting up deployment!

---

## 3.15 Deploy to Vercel

Let's put your app on the internet!

### Verify Your Fork is Ready

Your forked repository is already on GitHub, so you're ready to deploy!

1. Visit your forked repository:
   ```
   https://github.com/YOUR_USERNAME/isct-pbc-2025
   ```

2. Verify you can see all the course files

**Your code is already on GitHub - no additional setup needed!**

### Deploy with Vercel

1. Go to your Vercel dashboard (vercel.com)
2. Click "Add New" → "Project"

#### Install GitHub App (First Time Only)

If you see "Install the GitHub application" message:

3. Click **"Install"** button
   ![](images/2025-11-03-15-14-49.png)
4. You'll be redirected to GitHub authorization page
5. Choose repository access:
   - Select **"Only select repositories"**
   - Choose `isct-pbc-2025` from the dropdown
6. Click **"Install"**
7. You'll be redirected back to Vercel

#### Import Your Repository

8. You should now see your GitHub repositories
9. Find `isct-pbc-2025` (your forked repository)
10. Click "Import"

#### Configure the Project

**Important:** Since the app is in a subdirectory, you need to configure the root directory.

11. **Project Name**: `pet-management` (or your choice)
12. **Root Directory**: Click "Edit" and change to `apps/learning-phase-2`
   - This tells Vercel where to find your application
13. **Framework Preset**: Next.js (should be auto-detected)

#### Add Environment Variables

**Important:** Vercel needs the same environment variables as your local setup.

16. Expand "Environment Variables"
17. Add each variable:

**Variable 1:**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Your Supabase URL (same as in `.env`)

**Variable 2:**
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Your Supabase anon key (same as in `.env`)

**Variable 3:**
- **Name**: `DATABASE_URL`
- **Value**: Your database connection string (same as in `.env`)

![](images/2025-11-03-15-20-43.png)

18. Click "Deploy"

### Wait for Deployment

Vercel will:
1. Clone your repository
2. Install dependencies
3. Run the build
4. Deploy to a global CDN

**This takes 1-3 minutes.**

You'll see a progress log. When it's done, you'll see:

```
🎉 Congratulations! Your project has been deployed!
```

### Visit Your Live App

1. Vercel shows you the deployment URL (something like `https://pet-management-app.vercel.app`)
2. Click on it
3. You should see your app running live on the internet!

**Share the URL with your neighbor - they can access your app too!**


**But wait!** Notice that your deployed app still shows "Hello World" - not "Hello Pet Management App!" like your local version.

Why? **Because you haven't pushed your local changes to GitHub yet!**

Let's do that now and see the magic of automatic deployment.

---

## 3.16 Push Your Changes and See Auto-Deployment

Remember when you changed "Hello World" to "Hello Pet Management App!" on your local computer? That change is still only on your computer. Let's push it to GitHub and watch Vercel automatically deploy it!

### Understanding the Workflow

```
Your Computer (Local)
   "Hello Pet Management App!"
        ↓
   git add & commit (save changes)
        ↓
   git push (upload to GitHub)
        ↓
   GitHub Repository (updated)
        ↓
   Vercel detects changes
        ↓
   Automatic deployment
        ↓
   Live site updates automatically!
```
![](images/2025-11-03-15-54-41.png)


### Save Your Changes with Git (Using VSCode)

VSCode has built-in Git support, making it easy to commit and push without using commands!

1. **Open Source Control panel:**
   - Click the Source Control icon in the left sidebar (looks like a branch)
   
     ![](images/2025-11-03-15-56-55.png)

2. **See your changes:**
   - You should see `app/page.tsx` listed under "Changes"
   - Click on it to see what you changed (red = old, green = new)

3. **Stage your changes:**
   - Hover over "Changes" and click the **+** button
   - Or click the **+** next to `app/page.tsx`
   - The file moves to "Staged Changes"

4. **Commit your changes:**
   - At the top, you'll see a text box that says "Message"
   - Type: `Update welcome message to Pet Management App`
   - Click the **✓ Commit** button (or press `Ctrl+Enter` / `Cmd+Enter`)

5. **Push to GitHub:**
   - You'll see a button that says **"Sync Changes"** or **"Publish Branch"**
   - Click it

**First time pushing?** You'll need to authenticate with GitHub.

#### GitHub Authentication (First Time)

When you click "Sync Changes" for the first time, You will asked to sign in to GitHub. Please authorize it.

### Verify on GitHub

1. Go to your GitHub repository in your browser:
   ```
   https://github.com/YOUR_USERNAME/isct-pbc-2025
   ```

2. Navigate to `apps/learning-phase-2/app/page.tsx`

3. You should see your change: "Hello Pet Management App!"

✅ Your code is now on GitHub!

### Watch Automatic Deployment

**Here's the magic:** Vercel is watching your GitHub repository. When you pushed, Vercel automatically started deploying your changes!

1. Go to your Vercel dashboard (https://vercel.com)
2. Click on your project
3. You should see "Status" or "Created" changed
6. Click Domain to open the deployed URL
7. **You should now see "Hello Pet Management App!" - live on the internet!**

![](images/2025-11-03-16-08-56.png)

### Compare Local vs Production

Now you can see:

**Local (http://localhost:3000):**
- Your development environment
- Changes appear instantly with hot reload
- Only you can see it

**Production (https://your-app.vercel.app):**
- Live on the internet
- Anyone can access it
- Updates when you push to GitHub

**Congratulations! You've completed the full development workflow:**
- ✅ Made changes locally
- ✅ Tested with hot reload
- ✅ Committed to Git
- ✅ Pushed to GitHub
- ✅ Watched automatic deployment
- ✅ Verified changes live on the internet

**This is how professional developers work every day!**

### Daily Development

```
1. Open VSCode
2. Open terminal in VSCode (Ctrl+` or View → Terminal)
3. Run: npm run dev
4. Make changes in code
5. See updates in browser automatically
6. Repeat step 4-5
```

### Saving Progress

```
1. Make changes and test locally
2. Commit changes
3. Push to your GitHub fork:
4. Vercel automatically deploys your changes!
5. Check production URL to verify deployment
```


---

## What's Next?

You now have:

✅ A fully functional development environment
✅ A starter project running locally
✅ The project deployed to production
✅ All tools and accounts ready

**Now you're ready to start programming!**

In the next section, you'll begin building the Pet Management application by learning programming fundamentals:

- Variables
- Data structures
- Functions
- Conditionals
- Loops
- And more!

---


**Navigation:**
- **Previous:** [← Section 2: AI Agent Demo](02-demo-ai-agent.md)
- **Next:** [Section 4: Programming Basics →](04-programming-basics/README.md)
- **Home:** [README](../README.md)
