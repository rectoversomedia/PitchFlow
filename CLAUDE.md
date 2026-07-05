# PitchFlow by Rectoverso

AI-assisted sponsorship proposal workspace for media/TV teams.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Radix UI** (headless components)
- **Lucide React** (icons)
- **Mock data** (no real backend yet)

## Project Structure

```
src/
├── app/
│   ├── login/              # Split-screen login page
│   ├── dashboard/          # Main dashboard with KPI + pipeline
│   ├── brief-intake/        # Brief intake form + table
│   ├── proposal-builder/    # AI-powered proposal builder
│   ├── proposal-library/    # Proposal reference library
│   ├── brand-idea-explorer/ # Brand research + creative ideas
│   ├── sales-review/        # Sales feedback management
│   ├── layout.tsx           # Root layout with Inter font
│   └── globals.css          # Global styles + custom theme
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx      # Dark navy sidebar with navigation
│   │   ├── Header.tsx       # Top bar with search + user menu
│   │   └── MainLayout.tsx   # Layout wrapper
│   └── ui/                  # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── select.tsx
│       ├── tabs.tsx
│       ├── dialog.tsx
│       ├── avatar.tsx
│       ├── label.tsx
│       ├── progress.tsx
│       ├── table.tsx
│       └── dropdown-menu.tsx
└── lib/
    ├── utils.ts             # cn() utility
    ├── types.ts             # TypeScript interfaces
    └── mock-data.ts         # Mock data + constants
```

## Pages / Routes

| Route | Description |
|-------|-------------|
| `/login` | Split-screen login with dark branding left side |
| `/dashboard` | KPI cards + proposal pipeline kanban |
| `/brief-intake` | Brief form (left) + brief list table (right) |
| `/proposal-builder` | AI tools + proposal structure + comments |
| `/proposal-library` | Searchable proposal reference library |
| `/brand-idea-explorer` | Brand analysis + program recommendations |
| `/sales-review` | Sales feedback management + comments |

## Design System

### Colors
- **Primary Navy**: `#061A3A`
- **Accent Red**: `#E50914`
- **Purple (AI)**: `#7C3AED`
- **Blue**: `#2563EB`
- **Background**: `#F7F9FC`

### Typography
- Font: **Inter**
- Sidebar: dark navy background
- Main: white/light gray background

## Development

```bash
npm run dev    # Start dev server (runs on port 3000)
npm run build  # Production build
```

## Next Steps (Future)

- [ ] Add real authentication (Supabase/Firebase)
- [ ] Connect to database
- [ ] Implement AI endpoints
- [ ] Add file upload functionality
- [ ] Export proposal to PDF

## Reference Design

Design references are in `/Users/fajarpahlawan/Documents/PitchFlow/referensi/`:
- `Login.png` - Login page design
- `homepage.png` - Dashboard design
- `brief intake.png` - Brief intake form
- `proposal builder.png` - Proposal builder design
- `proposal library.png` - Library page design
- `brand & idea.png` - Brand explorer design
- `sales review.png` - Sales review design
