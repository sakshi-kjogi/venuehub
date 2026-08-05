# VenueHub — Architecture Decisions

This document records the core architectural decisions made for this project and the
reasoning behind them, so they don't need to be re-derived or re-argued later.

## 1. Monorepo

`client/` and `server/` live in one repository. Rationale: single developer building one
product where frontend and backend evolve together; one commit history keeps both sides
of a feature in sync. Trade-off accepted: less independence than a polyrepo, which is
fine at this team size.

## 2. Modular Monolith (not microservices)

One deployable Node.js process, internally organized into strict feature modules.
Rationale: microservices solve organizational scaling problems we don't have yet
(no multiple independent teams), while adding real operational cost (network calls,
distributed transactions, multiple deploy pipelines). Modules are designed with clear
boundaries so any module *could* be extracted into its own service later if it ever
needs to be — but we don't pay that complexity cost today.

## 3. Feature-based module structure

Backend code is organized by feature (`modules/venues/`, `modules/bookings/`, ...),
not by technical layer (`controllers/`, `services/` at the top level). Each module owns
its routes, controller, service, validation, and types.

**Module boundary rule:** a module may call another module's *service* functions, but
must never import another module's controllers, routes, or reach into its database
queries directly. This keeps module boundaries meaningful and makes future extraction
mechanical rather than a rewrite.

## 4. Pragmatic Clean Architecture

Within each module: `Route → Controller → Service → Prisma`. Dependencies point inward;
business logic (Service layer) has no knowledge of Express or HTTP. We deliberately do
NOT add abstract repository interfaces or a dependency-injection container — that level
of ceremony isn't justified at this project's scale and would slow down learning without
adding real flexibility we need.

## 5. TypeScript everywhere

The domain model is complex (16+ entities, 4 roles, nested relationships). Static types
catch shape mismatches between layers at compile time rather than in production.

## Module List (backend)

auth, users, venues, vendors, bookings, events, guests, budget, reviews, wishlist,
payments, notifications, chat, analytics, ai, admin

## Deployment Target

Frontend and backend both deploy to Railway as separate services from the same monorepo.
Database: Railway PostgreSQL or Neon PostgreSQL.