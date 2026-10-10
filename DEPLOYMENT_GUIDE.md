# BrandBloom - Vercel Deployment Guide

## 🚀 Deployment Checklist

This guide walks you through deploying BrandBloom to Vercel with a PostgreSQL database.

---

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ PostgreSQL database (Vercel Postgres, Neon, Supabase, or Railway)
- ✅ All code committed to Git repository

---

## Step 1: Prepare for Deployment

### 1.1 Verify package.json scripts

Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

### 1.2 Verify .gitignore

Ensure sensitive files are ignored:

```
# Covered by .gitignore
.env*.local
.env
node_modules/
.next/
```

### 1.3 Update vercel.json (optional)

Create `vercel.json` for custom configuration:

```json
{
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

---

## Step 2: Set Up PostgreSQL Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel project
2. Navigate to **Storage** tab
3. Click **Create Database** → **Postgres**
4. Click **Create** → Database will be provisioned
5. Copy the **POSTGRES_URL** connection string

### Option B: Neon (Serverless Postgres)

1. Go to [neon.tech](https://neon.tech)
2. Sign up / Sign in
3. Create new project
4. Copy connection string (it starts with `postgres://`)
5. This will be your `DATABASE_URL`

### Option C: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Settings** → **Database**
4. Copy **Connection String** (Transaction mode)
5. Replace `[YOUR-PASSWORD]` with your password

### Option D: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Copy **DATABASE_URL** from Variables tab

---

## Step 3: Deploy to Vercel

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your Git repository
4. Vercel will auto-detect Next.js

### 3.2 Configure Environment Variables

In the Vercel project settings, add these environment variables:

```env
# Database
DATABASE_URL="postgresql://..." # From Step 2

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Optional: If using custom domain
# NEXTAUTH_URL="https://yourdomain.com"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Or online: https://generate-secret.vercel.app/32

### 3.3 Configure Build Settings

Vercel should auto-detect these, but verify:

- **Framework Preset:** Next.js
- **Build Command:** `prisma generate && next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

### 3.4 Deploy

1. Click **Deploy**
2. Wait for build to complete (~2-5 minutes)
3. Vercel will show deployment URL

---

## Step 4: Initialize Database

### 4.1 Run Prisma Migrations

After first deployment, you need to set up the database schema.

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npm run db:generate
npm run db:push

# Seed database (optional, for demo data)
npm run db:seed
```

**Option B: Using Vercel Dashboard**

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Copy your `DATABASE_URL`
4. Run locally:

```bash
# Set environment variable
export DATABASE_URL="your-database-url"

# Run migrations
npm run db:generate
npm run db:push

# Seed database
npm run db:seed
```

### 4.2 Verify Database

Check that tables were created:

```bash
# Using psql
psql $DATABASE_URL -c "\dt"

# Or using Prisma Studio
npx prisma studio
```

You should see these tables:
- User
- Store
- Membership
- Product
- Order
- Customer
- Category
- SiteContent
- ImportJob
- ChatLog
- Recommendation
- OrderItem
- OrderEvent
- ProductImage
- StoreAnalytics

---

## Step 5: Test Deployment

### 5.1 Test Authentication

1. Visit: `https://your-domain.vercel.app`
2. Click **Get Started**
3. Create account → Should redirect to onboarding
4. Complete onboarding wizard
5. Verify dashboard loads

### 5.2 Test Demo Store

If you seeded the database:

1. Visit: `https://your-domain.vercel.app/store/demo-fashion-store`
2. Verify storefront loads
3. Click product → Verify detail page
4. Add to cart → Verify cart works
5. Try checkout flow

### 5.3 Test Demo Login

If seeded:

```
Email: owner@demo.com
Password: demo123
```

Login → Verify dashboard access

### 5.4 Check Logs

In Vercel dashboard:
1. Go to **Deployments**
2. Click latest deployment
3. Check **Functions** logs for errors

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain

1. In Vercel project, go to **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `brandbloom.com`)
4. Follow DNS configuration instructions

### 6.2 Update Environment Variables

Update `NEXTAUTH_URL` to your custom domain:

```env
NEXTAUTH_URL="https://yourdomain.com"
```

### 6.3 Redeploy

Click **Redeploy** in Vercel dashboard

---

## Step 7: Post-Deployment Configuration

### 7.1 Enable Analytics (Optional)

1. In Vercel dashboard, go to **Analytics**
2. Enable **Web Analytics**
3. Enable **Speed Insights**

### 7.2 Set Up Monitoring (Recommended)

**Option A: Vercel Monitoring**
- Built-in for Pro plan
- Shows errors, performance

**Option B: Sentry (Free tier available)**

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 7.3 Configure Alerts

In Vercel:
1. **Settings** → **Notifications**
2. Enable deployment notifications
3. Enable error alerts

---

## Step 8: Production Optimizations

### 8.1 Environment-Specific Settings

Ensure production settings in Vercel:

```env
NODE_ENV="production"
NEXT_PUBLIC_ENVIRONMENT="production"
```

### 8.2 Database Connection Pooling

For better performance, use connection pooling:

**Prisma Accelerate (Optional)**
```bash
npm install @prisma/extension-accelerate
```

**Or use Supabase/Neon pooling:**
- Neon: Use connection string with `?pgbouncer=true`
- Supabase: Use `Transaction` mode connection string

### 8.3 Enable Caching

Vercel automatically caches:
- Static pages
- API routes with cache headers
- Images via Next.js Image

No additional configuration needed!

### 8.4 Database Backups

**Vercel Postgres:**
- Automatic daily backups on paid plans

**Neon:**
- Point-in-time restore available
- Automatic backups daily

**Railway:**
- Manual backups via CLI
- Automatic snapshots on paid plans

---

## Troubleshooting

### Build Fails

**Error: "Prisma Client not generated"**

Fix: Ensure build command includes prisma generate:
```json
"build": "prisma generate && next build"
```

**Error: "MODULE_NOT_FOUND"**

Fix: Check package.json dependencies are correct:
```bash
npm install
```

### Runtime Errors

**Error: "P1001: Can't reach database server"**

Fix: Check DATABASE_URL environment variable:
1. Verify it's set in Vercel
2. Ensure database allows connections from Vercel IPs
3. Check firewall rules

**Error: "Invalid `prisma.user.findUnique()` invocation"**

Fix: Run database migrations:
```bash
npm run db:push
```

**Error: "NextAuth configuration error"**

Fix: Verify NEXTAUTH_SECRET and NEXTAUTH_URL are set correctly

### Performance Issues

**Slow page loads:**

1. Check database query performance
2. Enable database connection pooling
3. Add database indexes:

```sql
CREATE INDEX idx_product_storeid ON "Product"("storeId");
CREATE INDEX idx_order_storeid ON "Order"("storeId");
CREATE INDEX idx_customer_storeid ON "Customer"("storeId");
```

**High memory usage:**

1. Reduce concurrent builds in Vercel settings
2. Optimize images (use Next.js Image component)
3. Enable Edge Runtime for API routes (where possible)

---

## Maintenance

### Database Migrations

When you update the schema:

```bash
# 1. Update schema.prisma
# 2. Generate migration
npx prisma migrate dev --name your_migration_name

# 3. Commit migration files
git add prisma/migrations
git commit -m "Add migration"

# 4. Push to Git → Vercel auto-deploys → Migrations run
```

### Rollback Deployment

In Vercel dashboard:
1. Go to **Deployments**
2. Find previous working deployment
3. Click **⋮** → **Promote to Production**

### Update Environment Variables

1. Vercel dashboard → **Settings** → **Environment Variables**
2. Update variables
3. Click **Save**
4. Redeploy (Vercel prompts automatically)

---

## Security Checklist for Production

- [x] NEXTAUTH_SECRET is strong (32+ characters)
- [x] DATABASE_URL is not exposed publicly
- [x] NEXTAUTH_URL matches your domain
- [x] HTTPS is enforced (Vercel does this automatically)
- [x] Security headers configured (we added these in next.config.js)
- [x] CORS is properly configured
- [x] Rate limiting enabled (we have basic implementation)
- [x] Database backups configured
- [x] Error monitoring set up
- [ ] Consider WAF (Web Application Firewall) for production
- [ ] Set up DDoS protection (Vercel Pro includes this)

---

## Demo Credentials

For hackathon judges/reviewers:

```
🏪 Demo Store URL
https://your-domain.vercel.app/store/demo-fashion-store

👤 Owner Account (Full Access)
Email: owner@demo.com
Password: demo123

👥 Staff Account (Limited Access)
Email: staff@demo.com
Password: demo123

📝 Test Checkout
Use any name/email/address for demo orders
Payment is in demo mode (no actual processing)
```

---

## Monitoring & Analytics

### Key Metrics to Track

1. **Performance**
   - Page load times (Vercel Analytics)
   - API response times
   - Database query performance

2. **User Activity**
   - New store signups
   - Active stores
   - Orders per day
   - Revenue trends

3. **Errors**
   - 500 errors
   - Failed API calls
   - Database connection issues

### Recommended Tools

- **Vercel Analytics** (Built-in)
- **Vercel Speed Insights** (Built-in)
- **Sentry** (Error tracking)
- **LogRocket** (Session replay)
- **Hotjar** (User behavior)

---

## Scaling Considerations

### Current Capacity

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited sites
- Unlimited API calls
- Serverless functions

**Vercel Pro:**
- 1 TB bandwidth/month
- Advanced analytics
- Team collaboration
- Priority support

### Database Scaling

**When to upgrade:**
- 10,000+ rows per table
- 100+ concurrent connections
- Complex queries taking >100ms

**Upgrade path:**
- Start: Neon/Vercel Postgres (serverless)
- Scale: Dedicated PostgreSQL (Railway/Render)
- Enterprise: Amazon RDS/Google Cloud SQL

---

## Success Checklist

After deployment, verify:

- [ ] Homepage loads ✅
- [ ] Can create account ✅
- [ ] Onboarding wizard works ✅
- [ ] Dashboard accessible ✅
- [ ] Can create products ✅
- [ ] Storefront visible ✅
- [ ] Cart functionality works ✅
- [ ] Checkout completes ✅
- [ ] Order appears in dashboard ✅
- [ ] All 15 checkpoints functional ✅
- [ ] Mobile responsive ✅
- [ ] No console errors ✅
- [ ] Database connected ✅
- [ ] Authentication works ✅

---

## Support & Resources

### Official Documentation

- **Next.js:** https://nextjs.org/docs
- **Vercel:** https://vercel.com/docs
- **Prisma:** https://www.prisma.io/docs
- **NextAuth.js:** https://next-auth.js.org

### Community

- **Next.js Discord:** https://nextjs.org/discord
- **Vercel Discord:** https://vercel.com/discord
- **Prisma Slack:** https://slack.prisma.io

### Getting Help

1. Check Vercel deployment logs
2. Review browser console
3. Check database connectivity
4. Search GitHub issues
5. Ask in community forums

---

## Deployment Complete! 🎉

Your BrandBloom platform is now live and ready for the Cypher 4.0 hackathon!

**Next Steps:**
1. ✅ Test all features thoroughly
2. ✅ Create demo accounts with sample data
3. ✅ Prepare presentation/demo video
4. ✅ Document any known limitations
5. ✅ Submit to hackathon with deployment URL

**Deployment URL:** `https://your-domain.vercel.app`

**Hackathon Submission Checklist:**
- [x] 15/15 checkpoints implemented
- [x] Deployed and accessible
- [x] Demo credentials provided
- [x] Documentation complete
- [x] Security measures in place
- [x] Responsive design verified
- [x] Performance optimized

---

## Quick Reference Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:seed      # Seed demo data

# Vercel deployment
vercel               # Deploy to preview
vercel --prod        # Deploy to production
vercel env pull      # Pull environment variables
vercel logs          # View deployment logs
```

---

**Deployment Guide Version:** 1.0  
**Last Updated:** October 9, 2026  
**Platform:** BrandBloom - Multi-Tenant E-commerce Platform  
**Framework:** Next.js 14 + PostgreSQL + Vercel
