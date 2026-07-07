# PitchFlow

AI-powered sponsorship proposal workspace for media teams.

<div align="center">

![PitchFlow](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-3-green?style=flat-square&logo=supabase)

</div>

## Features

- **AI-Assisted Proposal Generation** - Generate winning sponsorship proposals with AI
- **Structured Brief Intake** - Capture client briefs with structured forms
- **Proposal Library** - Manage and organize proposal templates
- **Brand Idea Explorer** - Research and explore brand strategies
- **Sales Collaboration** - Team feedback and review workflows
- **Analytics Dashboard** - Track proposal performance and metrics
- **Calendar Integration** - Schedule deadlines and meetings

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js v5
- **AI**: Claude API (Anthropic)
- **Monitoring**: Sentry
- **Testing**: Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, or pnpm
- Supabase account
- Anthropic API key (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/rectoverso/pitchflow.git
cd pitchflow

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your credentials
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI
ANTHROPIC_API_KEY=your_anthropic_api_key

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AUTH_SECRET=generate_a_random_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Monitoring (optional)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Database Setup

Run the migration file in your Supabase dashboard:

```bash
# Location: supabase/migrations/002_clean_schema.sql
```

### Development

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linter
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to start.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript check |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with UI |

## Project Structure

```
pitchflow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── brief-intake/     # Brief intake
│   │   └── ...               # Other pages
│   ├── components/
│   │   ├── ui/              # Base UI components
│   │   └── layout/          # Layout components
│   ├── lib/
│   │   ├── validations/     # Zod schemas
│   │   ├── supabase/       # Supabase clients
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils.ts        # Utilities
│   └── test/                # Test setup
├── supabase/
│   └── migrations/          # Database migrations
├── e2e/                      # E2E tests
└── public/                   # Static assets
```

## API Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/briefs` | GET, POST, PUT, DELETE | Brief management |
| `/api/proposals` | GET, POST, PUT, DELETE | Proposal management |
| `/api/clients` | GET, POST, PUT, DELETE | Client management |
| `/api/events` | GET, POST, PUT, DELETE | Calendar events |
| `/api/sales-comments` | GET, POST, DELETE | Sales feedback |
| `/api/ai` | POST | AI-powered features |
| `/api/auth` | GET, POST, DELETE | Authentication |

## Security

- Row Level Security (RLS) on all database tables
- Session-based authentication
- Input validation with Zod
- Rate limiting on API endpoints
- Security headers (CSP, HSTS, etc.)
- Prompt injection prevention in AI endpoints

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

The app will automatically:
- Run the build command
- Enable preview deployments for PRs
- Configure edge caching

### Manual Deployment

```bash
# Build
npm run build

# Start
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Authors

- **Rectoverso Media** - [https://rectoverso.com](https://rectoverso.com)

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Anthropic](https://anthropic.com/)
