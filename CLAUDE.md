# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

키다리 선생님 - A professional volunteer platform connecting experts with high school students for career mentoring. This is a Next.js application serving as a landing page for managing volunteer activities and showcasing achievements.

## Development Commands

### Development Server

```bash
# Development mode with Turbopack
npm run dev

# Test environment
npm run dev:test
```

### Build and Production

```bash
# Build application
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

## Architecture Overview

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5.x, Tailwind CSS
- **Backend**: Next.js API Routes with tRPC 11.x
- **Database**: Supabase (PostgreSQL with client SDK)
- **UI Components**: Custom components with class-variance-authority
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React (optimized imports)
- **Animation**: Framer Motion

### Project Structure

#### Key Directories

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components organized by type
- `src/server/` - tRPC server setup and routers
- `src/shared/` - Schemas and types shared between client/server

#### Component Organization

- `components/ui/` - Basic UI components (buttons, inputs, cards, etc.)
- `components/features/landing/` - Landing page specific components
- `components/providers/` - React context providers

### tRPC API Structure

Basic tRPC setup with:

- Error formatting with Zod validation
- SuperJSON transformer for serialization
- Context-based architecture

### Environment Setup

Required environment variables (see `.env.sample`):

### Performance Optimizations

- Turbopack for development builds
- Lucide React package optimization via `optimizePackageImports`
- Console removal in production builds
- Image optimization for external domains (Google user content)

### Code Style Guidelines

- TypeScript with strict type checking
- Tailwind CSS for styling
- ESLint configuration with Next.js core web vitals
- Prettier for code formatting with lint-staged
- Unused variables prefixed with `_` are ignored

### Development Environment Requirements

- Node.js 22.x (specified in engines)
- npm 10.x (specified in engines)
- Environment variables for Supabase connection
