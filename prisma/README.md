# Database Setup Guide

## Prerequisites

You need a PostgreSQL database. You can use:

1. **Local PostgreSQL** - Install PostgreSQL locally
2. **Supabase** - Free hosted PostgreSQL (recommended for hackathon)
3. **Neon** - Serverless PostgreSQL
4. **Railway** - Hosted PostgreSQL
5. **Vercel Postgres** - Serverless PostgreSQL

## Quick Setup with Supabase (Recommended)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > Database
4. Copy the "Connection string" (URI format)
5. Paste it in your `.env.local` file:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

## Initialize Database

Once you have your DATABASE_URL set:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed demo data
npm run db:seed
```

## Database Commands

- `npm run db:generate` - Generate Prisma Client after schema changes
- `npm run db:push` - Push schema changes to database (dev)
- `npm run db:studio` - Open Prisma Studio (visual database browser)
- `npm run db:seed` - Seed database with demo data

## Schema Overview

### Core Entities

**Users & Auth**
- `User` - User accounts (owners, staff, shoppers)
- `Account` - OAuth provider accounts
- `Session` - User sessions
- `VerificationToken` - Email verification

**Multi-Tenant Structure**
- `Store` - Each business/store (tenant root)
- `Membership` - User-to-store relationships with roles
- `Category` - Product categories (store-scoped)
- `Product` - Products with variants and images
- `Customer` - Store customers (isolated per store)
- `Order` - Orders with items and events

**Content & Customization**
- `SiteContent` - Customizable page content
- `ImportJob` - CSV/Excel import tracking

**AI & Analytics**
- `ChatLog` - Chatbot conversation history
- `Recommendation` - BloomPilot recommendations
- `StoreAnalytics` - Daily metrics per store

### Multi-Tenant Isolation

Every store-owned entity has a `storeId` field:
- Products, categories, orders, customers, etc.
- All queries MUST be scoped by storeId
- Use helper functions in `lib/tenant.ts`

### Security Rules

1. **Never trust client-supplied storeId** - Always get it from server-side session
2. **Always scope queries** - Use `createScopedClient(storeId)` helper
3. **Verify access** - Check user membership before operations
4. **Audit sensitive actions** - Use `logAction()` helper

## Demo Data

After seeding, you'll have:

**Demo Store:** `demo-fashion-store`
- Live at: `/store/demo-fashion-store`
- 8 sample products across 4 categories
- 1 sample order
- Site content and theme configuration

**Demo Users:**
- Owner: `owner@demo.com` / `demo123`
- Staff: `staff@demo.com` / `demo123`

## Migrations (Production)

For production deployments, use migrations instead of db:push:

```bash
# Create migration
npx prisma migrate dev --name init

# Apply migrations in production
npx prisma migrate deploy
```

## Troubleshooting

### Connection Issues

- Verify DATABASE_URL format
- Check database is accessible from your network
- For Supabase: Ensure pooling mode is set to "Transaction"

### Schema Sync Issues

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Then regenerate and seed
npm run db:generate
npm run db:push
npm run db:seed
```

### Prisma Client Issues

```bash
# Clear Prisma cache
rm -rf node_modules/.prisma
npm run db:generate
```

## Production Checklist

- [ ] Use connection pooling (Prisma Accelerate or PgBouncer)
- [ ] Enable SSL for database connection
- [ ] Set up automated backups
- [ ] Configure row-level security (RLS) policies
- [ ] Add database indexes for performance
- [ ] Monitor query performance
- [ ] Set up database alerts

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
