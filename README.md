# PitchFlow 🚀

AI-assisted sponsorship proposal workspace for media/TV teams.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Security: Production Ready](https://img.shields.io/badge/Security-Production%20Ready-brightgreen)](https://github.com/rectoverso/pitchflow#-security-features)

<div align="center">

![PitchFlow](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-3-green?style=flat-square&logo=supabase)

</div>

## ✨ Features

- **AI-Powered Brief Analysis** - Leverage AI to analyze briefs and extract key insights
- **Proposal Builder** - Create compelling sponsorship proposals with AI assistance
- **Brand Explorer** - Deep brand DNA analysis for better targeting
- **Sales Pipeline** - Track proposal progress from draft to win/loss
- **Team Collaboration** - Comment system for sales feedback
- **Role-Based Access** - Secure access for Supervisor, ACS, and Sales roles
- **Production Ready** - Comprehensive security, validation, and error tracking

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | Tailwind CSS 4 + Radix UI |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth.js v5 |
| AI | Anthropic Claude API |
| Validation | Zod |
| Error Tracking | Sentry |
| Testing | Vitest + Playwright |

## 📁 Project Structure

```
pitchflow/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── briefs/         # Brief CRUD
│   │   │   ├── proposals/      # Proposal CRUD
│   │   │   ├── clients/        # Client CRM
│   │   │   ├── events/         # Calendar events
│   │   │   ├── sales-comments/ # Feedback comments
│   │   │   ├── ai/             # AI endpoints
│   │   │   ├── auth/           # NextAuth handlers
│   │   │   └── csrf/           # CSRF token endpoint
│   │   ├── dashboard/          # Main dashboard
│   │   ├── brief-intake/       # Brief submission
│   │   ├── proposal-builder/   # Proposal editor
│   │   ├── proposal-library/   # Reference library
│   │   ├── brand-idea-explorer/# Brand research
│   │   ├── brand-dna-explorer/ # Deep brand analysis
│   │   ├── sales-review/       # Sales feedback
│   │   ├── analytics/          # Performance metrics
│   │   ├── calendar/           # Event scheduling
│   │   ├── client-crm/         # Client management
│   │   ├── trend-radar/        # Market trends
│   │   ├── audience-insights/   # Audience analytics
│   │   ├── roi-calculator/     # ROI calculations
│   │   └── campaign-studio/    # Campaign management
│   ├── components/
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # Reusable UI components
│   ├── lib/
│   │   ├── auth.ts             # Auth configuration
│   │   ├── auth-context.tsx    # Auth context provider
│   │   ├── api-auth.ts         # API auth helpers
│   │   ├── validations.ts      # Zod schemas
│   │   ├── rate-limit.ts       # Rate limiting
│   │   ├── csrf.ts             # CSRF protection
│   │   ├── sentry.ts           # Error tracking
│   │   ├── env.ts              # Env validation
│   │   ├── types.ts            # TypeScript types
│   │   ├── mock-data.ts        # Mock data
│   │   └── supabase/           # Supabase clients
│   └── __tests__/              # Test files
├── docs/
│   └── openapi.json            # API documentation
├── supabase/
│   └── rls-policies.sql        # Row Level Security
└── public/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- Anthropic API key (for AI features)
- Google OAuth credentials (for login)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rectoverso/pitchflow.git
cd pitchflow
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Auth
AUTH_SECRET=generate-with-openssl-rand-base64-32
AUTH_TRUST_HOST=true
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI
ANTHROPIC_API_KEY=your-anthropic-key

# Sentry (optional but recommended)
SENTRY_DSN=https://your-dsn@sentry.io/project
```

4. **Generate AUTH_SECRET**
```bash
openssl rand -base64 32
```

5. **Set up Supabase**

Run the RLS policies in your Supabase SQL editor:
```bash
# In Supabase Dashboard > SQL Editor
# Copy contents of supabase/rls-policies.sql and execute
```

Required tables in Supabase:
- `briefs` - Brief intake records
- `proposals` - Proposal records
- `clients` - Client CRM data
- `events` - Calendar events
- `sales_comments` - Feedback comments
- `users` - User profiles

6. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Security Features

### ✅ Production-Ready Security Implementation

| Feature | Status | Description |
|---------|--------|-------------|
| **Row Level Security (RLS)** | ✅ | Users can only access their own data |
| **Input Validation** | ✅ | Zod schemas for all API endpoints |
| **Rate Limiting** | ✅ | Configurable limits per endpoint type |
| **CSRF Protection** | ✅ | Double-submit cookie pattern |
| **XSS Prevention** | ✅ | Input sanitization for all user data |
| **Error Tracking** | ✅ | Sentry integration |
| **Env Validation** | ✅ | Startup validation for required vars |
| **Auth Middleware** | ✅ | Protected route middleware |
| **Ownership Verification** | ✅ | Extra layer for UPDATE/DELETE |

### Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| AI endpoints | 20 req | 1 minute |
| Auth endpoints | 10 req | 1 minute |
| General API | 100 req | 1 minute |
| File uploads | 10 req | 1 minute |

### CSRF Protection

All mutating requests (POST, PUT, PATCH, DELETE) require:
1. A valid CSRF token in the `x-csrf-token` header
2. A matching CSRF cookie

Get a CSRF token:
```bash
curl -X GET https://your-domain.com/api/csrf
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

### Test Coverage Areas

- **Validation Schemas** - Zod validation for all inputs
- **Sanitization** - XSS prevention tests
- **Rate Limiting** - Limit enforcement tests
- **Environment Validation** - Config validation
- **Type Inference** - TypeScript type tests
- **Edge Cases** - Unicode, whitespace, boundary values
- **Performance** - Validation speed tests

## 📚 API Documentation

API documentation is available in OpenAPI 3.1 format:

- [docs/openapi.json](docs/openapi.json) - Full API specification

### API Endpoints

| Route | Methods | Auth | Rate Limit |
|-------|---------|------|------------|
| `/api/briefs` | GET, POST, PUT, DELETE | Required | General |
| `/api/proposals` | GET, POST, PUT, DELETE | Required | General |
| `/api/clients` | GET, POST, PUT, DELETE | Required | General |
| `/api/events` | GET, POST, PUT, DELETE | Required | General |
| `/api/sales-comments` | GET, POST, DELETE | Required | General |
| `/api/ai` | POST | Required | AI (20/min) |
| `/api/auth/[...nextauth]` | GET, POST | No | Auth |
| `/api/csrf` | GET | No | General |
| `/api/health` | GET | No | None |

### Example API Request

```bash
# Create a brief
curl -X POST https://your-domain.com/api/briefs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "brand_name": "Brand Indonesia",
    "pic_sales": "John Doe",
    "program": "Morning Show"
  }'
```

### API Response Format

```json
{
  "success": true,
  "data": { ... },
  "rateLimit": {
    "remaining": 99,
    "resetAt": 1234567890
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    { "field": "brand_name", "message": "Brand name is required" }
  ]
}
```

## 🔌 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript check |
| `npm test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:ui` | Run E2E with visual UI |

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel Dashboard:
   - `AUTH_SECRET`
   - `ANTHROPIC_API_KEY`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `SENTRY_DSN` (optional)
4. Deploy

### Other Platforms

Build the app:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## 🔧 Troubleshooting

### "AUTH_SECRET is not set"
Generate a new secret:
```bash
openssl rand -base64 32
```

### "Supabase connection failed"
Verify your Supabase URL and anon key are correct in `.env.local`.

### "AI features not working"
Make sure `ANTHROPIC_API_KEY` is set in your environment variables.

### "CSRF validation failed"
Refresh the page to get a new CSRF token. Ensure cookies are enabled.

### Rate limit exceeded
Wait for the rate limit window to reset (shown in `X-RateLimit-Reset` header).

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (`npm test`)
5. Submit a pull request

## 📞 Support

- Email: support@rectoverso.id
- GitHub Issues: [Create an issue](https://github.com/rectoverso/pitchflow/issues)

---

Built with ❤️ by [Rectoverso Media](https://rectoverso.id)
