# CarRental Platform

A production-grade Car Rental MVP with a Next.js (App Router) frontend, an Express/Node.js backend, and Supabase for database, auth, and storage.

## Features Built
- **Full Authentication**: Sign up, Login, Reset Password powered by Supabase Auth.
- **Frontend (Next.js)**: Modern, responsive UI with TailwindCSS and shadcn/ui.
- **BFF (Backend-for-Frontend)**: Next.js API Routes used to proxy requests securely to the backend.
- **Core Backend (Express)**: RESTful API built with TypeScript, Zod validation, and structured error handling.
- **Database (Supabase PostgreSQL)**: Managed with Drizzle ORM.
- **Car Browsing & Booking**: View cars, dynamic pricing, manage bookings (concurrency handled via SELECT FOR UPDATE).
- **Admin Dashboard**: Manage vehicles, upload images (Supabase Storage), oversee bookings and users.
- **Security & Scale**: Rate limiting (strict/standard/lenient), input sanitization, and fire-and-forget audit logs.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- npm
- A Supabase Project (for DB, Auth, and Storage)
- Supabase Storage Bucket: Create a public bucket named `avatars` (max size 5MB) and another named `car-images` (max size 5MB).

### 2. Environment Variables
Copy the example files and populate them with your Supabase credentials:

**Backend (`apps/backend/.env`)**
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database (Connection Pooling string from Supabase)
DATABASE_URL=your_supabase_db_url

# Stripe (Optional for Mocking)
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

**Frontend (`apps/frontend/.env.local`)**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Installation & Setup
Run the following commands from the root directory:

```bash
# Install dependencies for all workspaces
npm install

# Setup Database schema
cd apps/backend
npm run db:push

# Seed the database with sample cars
npm run db:seed
```

### 4. Running the Application
Start both the backend and frontend development servers.

Terminal 1 (Backend):
```bash
cd apps/backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd apps/frontend
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

### 5. Admin Access
To access the admin dashboard, create an account normally via the frontend. Then, in your Supabase SQL Editor or Database view, change your profile's `role` to `'admin'`.
