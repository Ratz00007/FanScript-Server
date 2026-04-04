# 🚀 FanScript - Tickets to Fans, Not Bots

A production-grade ticketing platform built with Node.js, NestJS, PostgreSQL, and React.

## 🎯 The Problem We're Solving

| Issue | Current State | Our Solution |
|-------|---------------|--------------|
| Hidden fees | 15-25%+ per ticket | 8% transparent |
| Bot scalping | 40%+ to bots | Verified fans |
| Opaque pricing | Algorithm decides | Artist controls |
| Poor UX | Crashes, errors | World-class experience |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND                          │
│              (Vite + TypeScript + Tailwind)                   │
└────────────────────────────┬────────────────────────────────┘
                             │ REST API
┌────────────────────────────▼────────────────────────────────┐
│                    NESTJS BACKEND                           │
│            (TypeScript + Prisma + PostgreSQL)                │
└────────────────────────────┬────────────────────────────────┘
                             │
    ┌───────────┬───────────┼───────────┬───────────┐
    │           │           │           │           │
┌───▼───┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───┐
│Events │  │Orders │  │Tickets│  │ Venues│  │Artists│
└───────┘  └───────┘  └───────┘  └───────┘  └───────┘
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js + NestJS |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Auth** | JWT + Passport |
| **Frontend** | React + Vite + TypeScript |
| **Styling** | Tailwind CSS |
| **Hosting** | Railway / Render (Free) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (use Supabase free tier)

### 1. Clone & Install

```bash
git clone https://github.com/your-repo/fanscript-server.git
cd fanscript-server
npm install
```

### 2. Setup Database

1. Create free PostgreSQL at https://supabase.com
2. Copy `.env.example` to `.env`
3. Update `DATABASE_URL` with your connection string

### 3. Run Migrations

```bash
npx prisma migrate dev
```

### 4. Start Development Server

```bash
npm run start:dev
```

Server runs at `http://localhost:3000`
API docs at `http://localhost:3000/api/docs`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List events
- `GET /api/events/featured` - Featured events
- `GET /api/events/:id` - Event details
- `POST /api/events` - Create event (venue)
- `PUT /api/events/:id` - Update event

### Orders
- `POST /api/orders` - Purchase tickets
- `GET /api/orders` - User orders
- `GET /api/orders/:id` - Order details

### Tickets
- `GET /api/tickets` - User tickets
- `GET /api/tickets/:id/qr` - Generate QR code

## 🔒 Security Features

- JWT authentication with refresh tokens
- Rate limiting (100 requests/minute)
- Helmet security headers
- Input validation with class-validator
- CORS configured
- bcrypt password hashing (12 rounds)

## 💰 Cost (Zero Budget)

| Service | Free Tier |
|---------|-----------|
| Database | Supabase |
| Hosting | Railway/Render |
| Domain | .tk |
| Email | Resend (free) |
| Analytics | Plausible |

**Total: ~€2/year (just domain)**

## 📄 License

MIT License - Feel free to use this for your startup!

---

**Built with ❤️ to fix the ticketing industry**
