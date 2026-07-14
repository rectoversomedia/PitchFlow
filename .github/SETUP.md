# GitHub Actions Setup Guide for PitchFlow

This guide walks you through setting up GitHub Actions for PitchFlow CI/CD.

## Prerequisites

1. Your PitchFlow repository on GitHub
2. Vercel account connected to your repository
3. Supabase project
4. Anthropic API key

## Step 1: Add GitHub Secrets

Go to your repository on GitHub → Settings → Secrets and variables → Actions

Add the following secrets:

### Required Secrets

| Secret Name | Description | Where to Find |
|-------------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `AUTH_SECRET` | NextAuth secret | Generate with `openssl rand -base64 32` |
| `ANTHROPIC_API_KEY` | Claude API key | Anthropic Console |

### Optional Secrets

| Secret Name | Description | Where to Find |
|-------------|-------------|---------------|
| `OPENAI_API_KEY` | OpenAI API key | OpenAI Platform |
| `SENTRY_DSN` | Sentry DSN | Sentry Dashboard |
| `VERCEL_TOKEN` | Vercel access token | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel organization ID | Vercel Dashboard → Settings |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel Dashboard → Settings |
| `CODECOV_TOKEN` | Codecov token | Codecov Dashboard |

## Step 2: Generate AUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and add it as `AUTH_SECRET` in GitHub Secrets.

## Step 3: Verify Vercel Connection

If deploying to Vercel, ensure:

1. Your repository is connected to Vercel
2. You have the Vercel CLI installed locally
3. You've created a Personal Access Token on Vercel

To get Vercel credentials:

```bash
# Login to Vercel CLI
vercel login
vercel link

# This will create a .vercel directory with project info
cat .vercel/project.json
```

## Step 4: Enable GitHub Actions

The workflows are already in `.github/workflows/`. They will automatically run on:

- **Push to `main` or `develop`** - Runs lint, type-check, test, build
- **Pull requests** - Runs lint, type-check, test, e2e, and deploys preview
- **Manual workflow dispatch** - Available in Actions tab

## Step 5: Monitor First Run

1. Go to the Actions tab in your GitHub repository
2. You should see the workflow running
3. Check each job for success/failure
4. Click on a failed job to see logs

## Workflows Overview

### CI Workflow (`ci.yml`)

| Job | Description | Timeout |
|-----|-------------|---------|
| `lint` | Runs ESLint | 5 min |
| `typecheck` | TypeScript type checking | 5 min |
| `test` | Unit tests with coverage | 10 min |
| `build` | Next.js production build | 15 min |
| `e2e` | Playwright E2E tests | 15 min |
| `security-scan` | Security audit | 5 min |

### Deploy Workflow (`deploy.yml`)

| Environment | Trigger | Description |
|------------|---------|-------------|
| Preview | Pull Request | Deploys PR preview URL |
| Staging | Push to `develop` | Deploys to staging |
| Production | Push to `main` | Deploys to production |

## Troubleshooting

### Build Failures

1. Check environment variables are set in GitHub Secrets
2. Verify Supabase URL format: `https://xxx.supabase.co`
3. Ensure `AUTH_SECRET` is at least 32 characters

### Test Failures

1. Run tests locally: `npm test`
2. Check for environment variable issues
3. Review test logs for specific failures

### E2E Test Failures

1. Ensure Supabase is accessible
2. Check if rate limits are causing issues
3. Review Playwright test logs

### Deployment Failures

1. Verify Vercel credentials
2. Check environment variables match local `.env.local`
3. Ensure repository is connected to Vercel

## Adding New Secrets

If you add new environment variables:

1. Add them to `.env.example`
2. Add them to GitHub Secrets
3. Update `.github/workflows/ci.yml` to include the new secret in the build step
4. Document in this file

## Useful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git/vercel-for-github)
- [Supabase Documentation](https://supabase.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
