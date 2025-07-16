# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a monorepo for mando.cx, a comprehensive customer service and knowledge management SaaS platform. It uses pnpm workspaces and Turborepo for monorepo management.

## Architecture

### Apps (Frontend Applications)

- **web-dashboard** (port 3000): Main dashboard for managing the platform
- **web-cs** (port 3001): Customer service interface
- **web-hc** (port 3002): Help center application
- **web-nr** (port 3003): Newsroom application
- **web-marketing** (port 3004): Marketing website
- **web-as** (port 3005): Assistant application
- **api**: Backend API service using Hono framework

### Shared Libraries

- **@mando/db**: Database layer using Drizzle ORM with PostgreSQL
- **@mando/ui**: Shared UI components library
- **@mando/services**: Shared business logic and services (AI, auth, storage, etc.)
- **@mando/queues**: Background job processing using Trigger.dev
- **@mando/emails**: Email templates and functionality
- **@mando/webhooks**: Webhook handling with Svix
- **@mando/cs-shell**: Customer service shell/widget
- **@mando/tsconfig**: Shared TypeScript configurations

### Tech Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS v4, Motion
- **Backend**: Hono (web framework), tRPC (type-safe APIs)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **AI**: AI SDK with multiple model support
- **Background Jobs**: Trigger.dev v4
- **Internationalization**: Inlang/Paraglide
- **Code Quality**: Biome (linting/formatting via Ultracite), Sherif (monorepo consistency), Knip (dead code detection)
- **Testing**: Vitest with React Testing Library
- **Git Hooks**: Husky with Commitlint (conventional commits)

## Common Commands

### Development

```bash
# Run all apps
pnpm dev

# Run specific app(s)
pnpm dev --filter=web-dashboard
pnpm dev --filter=web-dashboard --filter=web-cs

# Run a single test file
pnpm test path/to/test.spec.ts
```

### Code Quality

```bash
# Linting
pnpm lint          # Check for issues
pnpm lint:fix      # Fix issues

# Formatting
pnpm format        # Check formatting
pnpm format:fix    # Fix formatting

# Type checking (run in specific app)
pnpm --filter=web-dashboard typecheck

# Monorepo consistency check
pnpm monorepo:lint

# Unused code detection with Knip
pnpm knip                # Find unused files, dependencies, and exports
pnpm knip:production     # Check only production code (excludes devDependencies)
pnpm knip:fix            # Automatically remove unused files and exports (use with caution!)

# Knip for specific workspace
pnpm knip --workspace apps/web-dashboard

# Knip with specific reporters
pnpm knip --reporter json > knip-report.json  # Generate detailed report
pnpm knip --reporter compact                  # Compact output
```

### Database

```bash
# Navigate to libs/db first
cd libs/db

# Open Drizzle Studio (database GUI)
pnpm studio

# Generate migrations
pnpm kit generate

# Push migrations
pnpm kit push

# Run migrations
pnpm kit migrate

# Seed database
pnpm seed

# Database backup
pg_dump -Fc --no-owner --no-privileges --verbose "postgres://...:...@...:.../...?" > backup_file.dump

# Database restore (first run migrations, then restore data)
# 1. Extract restore list
pg_restore --list backup_file.dump > restore_list.txt

# 2. Extract data only
grep "TABLE DATA" restore_list.txt > data_only_list.txt

# 3. Manually order tables in data_only_list.txt to avoid foreign key errors

# 4. Restore data
pg_restore -d "postgres://...:...@...:.../...?" \
  --no-owner \
  --no-privileges \
  --use-list=data_only_list.txt \
  backup_file.dump
```

### Build & Production

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build --filter=web-dashboard

# Start production server (after build)
pnpm --filter=web-dashboard start
```

### Background Jobs (Trigger.dev)

```bash
# Navigate to libs/queues
cd libs/queues

# Start Trigger.dev dev server
pnpm trigger

# Deploy Trigger.dev
pnpm trigger:deploy
```

### Internationalization

```bash
# Validate Inlang configuration (run in specific app)
pnpm --filter=web-marketing inlang:validate

# Message files are located in each app's messages/ directory
# Example: apps/web-marketing/messages/en.json
```

- Each app has its own Inlang configuration in `project.inlang/settings.json`
- Supported locales: ar, de, en, es, fr, pt, tr
- Base locale: en
- Messages use the message-format plugin
- Paraglide.js is used for type-safe translations

## Key Architectural Patterns

### 1. Frontend Architecture

- All apps use React Router v7 with file-based routing
- Server-side rendering with streaming support
- Shared UI components from @mando/ui
- tRPC for type-safe API calls between frontend and backend
- React Query for data fetching and caching

### 2. Backend Architecture

- Hono serves as the web framework for all apps
- tRPC routers define API endpoints in `server/orpc/`
- Services layer (@mando/services) handles business logic
- Background jobs are processed by Trigger.dev in @mando/queues

### 3. Database Patterns

- All database models are defined in `libs/db/src/schema/`
- Use TypeIDs for primary keys (e.g., `org_123abc`)
- Drizzle ORM for type-safe database queries
- Database migrations tracked in `libs/db/drizzle/`

### 4. Authentication Flow

- Clerk handles authentication across all apps
- Member-based access control (members belong to organizations)
- Guards implemented in middleware for protected routes

### 5. AI Integration

- AI services centralized in `libs/services/src/ai/`
- Support for multiple AI providers (OpenAI, Anthropic, etc.)
- Vector store using Turbopuffer for semantic search
- Embedding service for content indexing

## Development Workflow

1. **Feature Development**: Create feature branches, implement changes across relevant apps/libs
2. **Testing**: Run tests with `pnpm test` before committing (uses Vitest)
3. **Code Quality**: 
   - Run `pnpm lint` to check for issues (uses Ultracite/Biome)
   - Run `pnpm lint:fix` to auto-fix issues
   - Run `pnpm knip` to check for unused code
   - Run `pnpm monorepo:lint` to check monorepo consistency (Sherif)
4. **Type Safety**: Run `pnpm typecheck` in affected apps
5. **Commits**: Follow conventional commit format (enforced by Commitlint via Husky hooks)

## Important Notes

- Always use pnpm (v10.12.4) for package management
- Dependencies are centralized in `pnpm-workspace.yaml` using the catalog feature
- Environment variables are loaded with dotenvx
- All apps share the same Tailwind CSS v4 configuration
- React Router apps have their config in `react-router.config.ts`
- Database connection strings and other secrets should be in `.env.local`
- Use Ultracite for unified linting/formatting (wraps Biome)
- Pre-commit hooks are configured with Husky to ensure code quality
- Dead code detection with Knip helps maintain a clean codebase
