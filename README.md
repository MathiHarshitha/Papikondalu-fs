# Papikondalu Tourism - Full Stack Application

A complete enterprise tourism booking platform for Papikondalu boat tours on the Godavari river.

## Tech Stack

**Backend:** NestJS, PostgreSQL, Prisma ORM, Redis, JWT Auth, Razorpay, AWS S3, Resend  
**Frontend:** Next.js 15, React 18, TailwindCSS, TanStack Query, Zustand, Framer Motion

---

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (for PostgreSQL + Redis)
- Or: PostgreSQL 15+ and Redis 7+ installed locally

### 1. Start Database & Redis

```bash
docker-compose up -d
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed sample data (admin user + packages)
npm run prisma:seed

# Start development server
npm run start:dev
```

Backend runs at: http://localhost:3001  
Swagger docs: http://localhost:3001/api/docs

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

Frontend runs at: http://localhost:3000

---

## Default Admin Credentials

After seeding:
- **Email:** admin@papikondalu.com
- **Password:** Admin@123

---

## Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_REFRESH_SECRET` | Refresh token secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `REDIS_HOST` | Redis host |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `RESEND_API_KEY` | Resend email API key |
| `AWS_ACCESS_KEY_ID` | AWS S3 access key |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret key |
| `AWS_S3_BUCKET` | S3 bucket name |

### Frontend (.env.local)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay publishable key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key |

---

## Features

- **Authentication:** JWT + Google OAuth, refresh tokens, password reset
- **Packages:** CRUD, categories, search/filter, image gallery, availability
- **Bookings:** Multi-passenger booking, QR code tickets, cancellation
- **Payments:** Razorpay integration, webhook handling, refunds
- **Reviews:** Submit, moderate (admin approve/reject), ratings
- **Notifications:** Email (Resend) + WhatsApp Cloud API
- **Admin Panel:** Dashboard with charts, user/package/booking management
- **Reports:** Revenue, tourist count, booking trends, popular packages
- **Storage:** AWS S3 + CloudFront for images

## Project Structure

```
Papikondalu-FS/
├── backend/                 # NestJS API
│   ├── prisma/             # Schema + migrations + seed
│   └── src/
│       ├── auth/           # JWT + Google OAuth
│       ├── bookings/       # Booking management
│       ├── packages/       # Tour packages
│       ├── payments/       # Razorpay integration
│       ├── reviews/        # Review system
│       ├── users/          # User management
│       ├── notifications/  # Email + WhatsApp
│       ├── reports/        # Analytics
│       ├── admin/          # Admin utilities
│       ├── contact/        # Contact form
│       ├── newsletter/     # Newsletter subscriptions
│       ├── storage/        # AWS S3
│       ├── redis/          # Redis caching
│       └── common/         # Guards, filters, decorators
├── frontend/               # Next.js 15 App
│   └── src/
│       ├── app/
│       │   ├── (auth)/     # Login, register, callback
│       │   ├── (public)/   # Packages, about, gallery, etc.
│       │   ├── (protected)/# Dashboard, booking checkout
│       │   └── admin/      # Admin panel
│       ├── components/     # Reusable UI components
│       ├── hooks/          # React Query hooks
│       ├── store/          # Zustand state
│       ├── lib/            # API client, utilities
│       └── types/          # TypeScript types
└── docker-compose.yml      # Local dev services
```
