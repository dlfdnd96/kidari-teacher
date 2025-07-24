# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

키다리 선생님 - A professional volunteer platform connecting experts with high school students for career mentoring. This is a Next.js application with tRPC, Prisma, and PostgreSQL serving as a platform for managing volunteer activities, applications, and notices.

## Development Commands

### Database Management

```bash
# Start PostgreSQL container
docker compose up -d postgres

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# With specific environment file
docker compose --env-file SOME_PATH_ENV_FILE up -d
```

### Development Server

```bash
# Development mode with Turbopack
npm run dev

# Test environment
npm run dev:test
```

### Build and Production

```bash
# Build application (includes prisma generate)
npm run build

# Start production server
npm start
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Testing

```bash
# Run E2E tests
npm run test:e2e

# Open Cypress GUI (start dev server first)
npm run dev:test
npm run cypress:open

# Run Cypress tests
npm run cypress:run
```

## Architecture Overview

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5.x, Tailwind CSS
- **Backend**: Next.js API Routes with tRPC 11.x
- **Database**: PostgreSQL with Prisma ORM 6.x
- **Authentication**: NextAuth.js with Google/Kakao/Naver OAuth
- **UI Components**: shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React (optimized imports)
- **Testing**: Cypress for E2E testing

### Project Structure

#### Key Directories

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components organized by type
- `src/server/` - tRPC server setup, routers, and context
- `src/shared/` - Schemas and types shared between client/server
- `prisma/` - Database schema and migrations
- `cypress/` - E2E tests with page objects and fixtures

#### Component Organization

- `components/ui/` - Basic UI components (buttons, inputs, etc.)
- `components/features/` - Feature-specific components organized by domain
- `components/layout/` - Layout components (Header, Footer, Navbar)
- `components/common/` - Common utility components
- `components/icons/` - Custom icon components

### Database Schema

Main entities managed through Prisma:

- **Users**: Authentication and role management (USER/ADMIN)
- **UserProfile**: Extended user information and profession details
- **VolunteerActivity**: Events with status workflow (PLANNING → RECRUITING → SELECTED → IN_PROGRESS → COMPLETED)
- **Application**: User applications to volunteer activities
- **Notice**: Announcements and news

### tRPC API Structure

API organized in routers at `src/server/routers/`:

- `notice` - Notice management
- `volunteer-activity` - Activity creation and management
- `application` - Application submissions and status
- `user` - User management
- `user-profile` - Profile management

### Authentication System

- Multi-provider OAuth (Google, Kakao, Naver)
- JWT-based session management (14-day expiry)
- Role-based access control (USER/ADMIN)
- Custom sign-in page at `/profile/check`

### Development Environment Requirements

- Node.js 22.x (specified in engines)
- Docker & Docker Compose for PostgreSQL
- Environment variables for OAuth providers and database connection

### Testing Strategy

- Cypress E2E tests cover critical user flows
- Page Object Model for maintainable test structure
- Test data fixtures and custom commands
- Separate test database environment

### Performance Optimizations

- Turbopack for development builds
- Lucide React package optimization
- Console removal in production builds
- Image optimization for external domains

**Bundle Size Optimization**

- Utilize `optimizePackageImports` to include only necessary modules in the bundle
- Apply code splitting with dynamic imports
- Use individual imports for icon libraries

```javascript
// ❌ Avoid this approach
import { Icon1, Icon2 } from 'react-icons/md'

// ✅ Recommended approach
import Icon1 from 'react-icons/md/Icon1'
import Icon2 from 'react-icons/md/Icon2'
```

**Rendering Optimization**

- Properly separate Server Components and Client Components
- Move Client Components down the tree to minimize bundle size
- Use `next/image` component for automatic image optimization
- Use `next/font` module to prevent layout shift

#### Code Structure Improvement

**Component Separation Strategy**

```typescript
// ✅ Separate only interactive elements as Client Components in layout
import SearchBar from './searchbar' // Client Component
import Logo from './logo' // Server Component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <SearchBar />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

**Module Path Optimization**

- Improve readability using absolute path aliases (`@/components`)
- Eliminate relative paths in deeply nested structures

#### Next.js-Specific Optimization

**App Router vs Pages Router**

- Recommend using App Router for new features
- Migrate `getLayout` pattern to native layouts
- Upgrade API Routes to Route Handlers

**Leverage Built-in Optimization Features**

- Optimize third-party scripts with `<Script>` component
- Utilize automatic prefetching of `<Link>` component
- Update static pages with ISR (Incremental Static Regeneration)

**Caching Strategy**

```javascript
// Utilize Cache-Control headers
export async function getServerSideProps({ req, res }) {
	res.setHeader(
		'Cache-Control',
		'public, s-maxage=10, stale-while-revalidate=59',
	)
	return { props: {} }
}
```

#### Code Quality and Maintainability

**ESLint Rules Application**

- Comply with Core Web Vitals using `next/core-web-vitals` rules
- Prevent anti-patterns with Next.js-specific rules:
  - `no-img-element`: Use `<Image>` instead of `<img>`
  - `no-html-link-for-pages`: Use `<Link>` instead of `<a>`
  - `inline-script-id`: Require `id` attribute for inline scripts

**Type Safety**

- Prevent runtime errors in advance with TypeScript
- Clearly define Props interfaces
- Define API response types

#### Security and Deployment Considerations

**Environment Variable Management**

- Add `.env.*` files to `.gitignore`
- Use `NEXT_PUBLIC_` prefix for client-exposed variables
- Access sensitive information only on server-side

**SEO and Accessibility**

- Optimize SEO with `next/head` or Metadata API
- Utilize accessibility ESLint rules (`eslint-plugin-jsx-a11y`)
- Follow semantic HTML structure

#### Data Fetching Optimization

**Efficient Data Fetching**

- Access data sources directly instead of API routes in `getStaticProps`
- Separate common data fetching logic to `lib/` directory
- Apply appropriate caching strategies

**Code Example:**

```javascript
// lib/load-posts.js - Separate common logic
export async function loadPosts() {
	const res = await fetch('https://.../posts/')
	return res.json()
}

// Utilize in getStaticProps
export async function getStaticProps() {
	const posts = await loadPosts() // Direct call instead of API route
	return { props: { posts } }
}
```

### Code Style Guidelines

Based on `.cursor/rules/frontend-rule.mdc`:

- TypeScript with strict type checking
- Tailwind CSS for styling with mobile-first approach
- Component structure following atomic design principles
- SOLID principles implementation
- Security-first approach with input validation via Zod

### Database Development Notes

- Soft deletes implemented via `deletedAt` fields
- Proper indexing on commonly queried fields
- Foreign key relationships with cascading deletes for auth tables
- Environment-specific database configurations
