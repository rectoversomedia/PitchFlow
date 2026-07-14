# PitchFlow - AI-assisted sponsorship proposal workspace for media/TV teams

## Project Overview

PitchFlow is a Next.js application for managing sponsorship proposals with AI assistance. Built with security and production-readiness as core requirements.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI**: Tailwind CSS 4 + Radix UI
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js v5 (JWT)
- **AI**: Anthropic Claude API
- **Validation**: Zod
- **Testing**: Vitest + Playwright
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   │   ├── briefs/         # Brief CRUD
│   │   ├── proposals/      # Proposal CRUD
│   │   ├── clients/        # Client CRM
│   │   ├── events/         # Calendar events
│   │   ├── sales-comments/ # Feedback comments
│   │   ├── ai/             # AI endpoints
│   │   ├── auth/           # NextAuth handlers
│   │   ├── csrf/           # CSRF protection
│   │   └── upload/         # File uploads
│   └── [pages]/            # Page components
├── components/
│   ├── ui/                 # Reusable UI components
│   └── layout/              # Layout components
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── password.ts         # Password hashing (bcrypt)
│   ├── rate-limit.ts        # Rate limiting (Redis/in-memory)
│   ├── ai-service.ts        # Unified AI service (Claude)
│   ├── csrf.ts             # CSRF protection
│   ├── env.ts              # Environment validation
│   ├── validations/         # Zod schemas
│   ├── supabase/           # Supabase clients
│   └── utils.ts            # Utilities
├── hooks/                   # React hooks
├── types/                   # TypeScript types
└── __tests__/              # Unit tests
```

## Database Schema

### Tables
- `users` - User profiles and roles
- `briefs` - Brief intake records
- `proposals` - Sponsorship proposals
- `clients` - Client CRM data
- `events` - Calendar events
- `sales_comments` - Feedback comments

### Row Level Security (RLS)
All tables have RLS enabled. Users can only access their own data.

## Security Features

| Feature | Implementation |
|---------|--------------|
| RLS | Supabase Row Level Security |
| Auth | NextAuth.js v5 JWT |
| Rate Limiting | Redis (Upstash) or in-memory |
| CSRF | Double-submit cookie |
| Input Validation | Zod schemas |
| XSS Prevention | Input sanitization |
| Password Hashing | bcrypt (12 rounds) |

## AI Features

Uses Claude API for:
- Brand DNA Analysis
- Creative Ideas Generation
- Proposal Content Generation
- Reference Search
- Text Improvement
- Trend Analysis
- Audience Insights
- ROI Calculation

## Environment Variables

Required:
- `AUTH_SECRET` - NextAuth secret (min 32 chars)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `ANTHROPIC_API_KEY` - Claude API key

Optional:
- `OPENAI_API_KEY` - For image generation
- `UPSTASH_REDIS_REST_URL` - Redis for distributed rate limiting
- `UPSTASH_REDIS_REST_TOKEN` - Redis token
- `SENTRY_DSN` - Error tracking

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
npm run test:e2e    # E2E tests
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## Deployment

Deployed on Vercel. See `.github/workflows/` for CI/CD configuration.

## Supabase Project

- **Project ID**: bfzeixmnudtshvscigwm
- **Region**: ap-northeast-2
- **Status**: ACTIVE_HEALTHY
