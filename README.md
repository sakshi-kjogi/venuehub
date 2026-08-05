# VenueHub — Plan. Book. Celebrate.

VenueHub is an event and venue booking ecosystem connecting Customers, Venue Owners,
Vendors, and Administrators on a single platform for discovering venues, hiring vendors,
planning events, tracking budgets, and managing guests — with real-time chat, secure
payments, and AI-powered recommendations.

## Tech Stack

**Frontend:** React 19, Vite, TypeScript, React Router DOM, Tailwind CSS, shadcn/ui,
TanStack Query, React Hook Form, Zod, Zustand

**Backend:** Node.js, Express.js, TypeScript, Prisma ORM, JWT Auth, Socket.IO

**Database:** PostgreSQL

**Storage:** Cloudinary — **Payments:** Razorpay — **Deployment:** Railway

## Project Structure

This is a monorepo with two workspaces:

- `client/` — React frontend (scaffolded Day 3)
- `server/` — Express backend (scaffolded Day 2)

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for module boundaries and design decisions.

## Local Development

> Setup instructions will be filled in as `client/` and `server/` are scaffolded
> (Day 2 and Day 3). Environment variable reference lives in `.env.example`.

## Development Roadmap

This project is being built as 20 incremental milestones, from architecture and setup
through auth, core features, payments, real-time chat, AI recommendations, and finally
testing/security/deployment. See project documentation for the full roadmap.

## Status

🚧 In active development — Day 1 (Planning & Setup) complete.