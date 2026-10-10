# BrandBloom - Project Structure Guide

## 📁 Frontend vs Backend Organization

In Next.js 14 App Router, frontend and backend code coexist in the same directory structure. Here's how to identify each:

---

## 🎨 FRONTEND (UI/Client-Side)

### `app/` - Frontend Pages & Layouts

```
app/
├── page.tsx                    ✅ FRONTEND - Landing page
├── layout.tsx                  ✅ FRONTEND - Root layout
├── globals.css                 ✅ FRONTEND - Global styles
│
├── auth/
│   ├── signin/
│   │   └── page.tsx           ✅ FRONTEND - Sign in page
│   └── signup/
│       └── page.tsx           ✅ FRONTEND - Sign up page
│
├── onboarding/
│   └── page.tsx               ✅ FRONTEND - Onboarding wizard
│
├── dashboard/                  ✅ FRONTEND - Dashboard pages
│   ├── layout.tsx             ✅ FRONTEND - Dashboard layout
│   ├── page.tsx               ✅ FRONTEND - Dashboard home
│   ├── products/
│   │   ├── page.tsx           ✅ FRONTEND - Products list
│   │   ├── new/
│   │   │   └── page.tsx       ✅ FRONTEND - Add product
│   │   ├── import/
│   │   │   └── page.tsx       ✅ FRONTEND - Import wizard
│   │   └── [productId]/
│   │       └── page.tsx       ✅ FRONTEND - Edit product
│   ├── orders/
│   │   ├── page.tsx           ✅ FRONTEND - Orders list
│   │   └── [orderId]/
│   │       └── page.tsx       ✅ FRONTEND - Order detail
│   ├── customers/
│   │   └── page.tsx           ✅ FRONTEND - Customers list
│   ├── analytics/
│   │   └── page.tsx           ✅ FRONTEND - Analytics
│   ├── appearance/
│   │   └── page.tsx           ✅ FRONTEND - Theme selector
│   ├── content/
│   │   └── page.tsx           ✅ FRONTEND - Content editor
│   ├── settings/
│   │   └── page.tsx           ✅ FRONTEND - Store settings
│   ├── team/
│   │   └── page.tsx           ✅ FRONTEND - Team management
│   ├── chatbot/
│   │   └── page.tsx           ✅ FRONTEND - AI Chatbot
│   └── bloompilot/
│       └── page.tsx           ✅ FRONTEND - BloomPilot AI
│
└── store/[slug]/               ✅ FRONTEND - Public storefront
    ├── page.tsx               ✅ FRONTEND - Store homepage
    ├── products/
    │   └── page.tsx           ✅ FRONTEND - Products listing
    ├── product/[productSlug]/
    │   └── page.tsx           ✅ FRONTEND - Product detail
    ├── category/[categorySlug]/
    │   └── page.tsx           ✅ FRONTEND - Category page
    ├── cart/
    │   └── page.tsx           ✅ FRONTEND - Shopping cart
    ├── checkout/
    │   └── page.tsx           ✅ FRONTEND - Checkout
    └── order/[orderId]/confirmation/
        └── page.tsx           ✅ FRONTEND - Order confirmation
```

### `components/` - Frontend Components

```
components/                     ✅ FRONTEND - All React components
├── ui/                        ✅ FRONTEND - Base UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── label.tsx
│
├── providers/                 ✅ FRONTEND - Context providers
│   └── session-provider.tsx
│
├── onboarding/                ✅ FRONTEND - Onboarding steps
│   ├── store-details-step.tsx
│   ├── categories-step.tsx
│   ├── products-step.tsx
│   ├── theme-step.tsx
│   └── review-step.tsx
│
├── dashboard/                 ✅ FRONTEND - Dashboard components
│   └── dashboard-nav.tsx
│
├── products/                  ✅ FRONTEND - Product components
│   ├── product-form.tsx
│   └── delete-product-button.tsx
│
├── orders/                    ✅ FRONTEND - Order components
│   ├── order-status-updater.tsx
│   └── order-timeline.tsx
│
├── settings/                  ✅ FRONTEND - Settings components
│   └── store-settings.tsx
│
├── content/                   ✅ FRONTEND - Content components
│   └── content-editor.tsx
│
├── team/                      ✅ FRONTEND - Team components
│   ├── team-members-list.tsx
│   └── invite-team-member.tsx
│
├── theme/                     ✅ FRONTEND - Theme components
│   ├── theme-selector.tsx
│   ├── theme-preview.tsx
│   └── storefront-theme-provider.tsx
│
├── storefront/                ✅ FRONTEND - Storefront components
│   ├── storefront-layout.tsx
│   ├── storefront-header.tsx
│   ├── storefront-hero.tsx
│   ├── storefront-footer.tsx
│   ├── category-grid.tsx
│   ├── featured-products.tsx
│   ├── product-list.tsx
│   └── product-detail.tsx
│
├── cart/                      ✅ FRONTEND - Cart components
│   ├── cart-provider.tsx
│   └── cart-page.tsx
│
├── checkout/                  ✅ FRONTEND - Checkout components
│   └── checkout-page.tsx
│
├── chatbot/                   ✅ FRONTEND - Chatbot UI
│   └── chat-interface.tsx
│
└── bloompilot/                ✅ FRONTEND - BloomPilot UI
    └── bloompilot-interface.tsx
```

### Frontend Styling

```
├── app/globals.css            ✅ FRONTEND - Global styles
├── tailwind.config.ts         ✅ FRONTEND - Tailwind config
└── postcss.config.js          ✅ FRONTEND - PostCSS config
```

---

## ⚙️ BACKEND (API/Server-Side)

### `app/api/` - Backend API Routes

```
app/api/                        ❌ BACKEND - All API routes
├── auth/
│   ├── [...nextauth]/
│   │   └── route.ts           ❌ BACKEND - NextAuth handler
│   └── signup/
│       └── route.ts           ❌ BACKEND - User registration
│
├── onboarding/
│   ├── check-slug/
│   │   └── route.ts           ❌ BACKEND - Slug validation
│   └── complete/
│       └── route.ts           ❌ BACKEND - Create store
│
├── products/
│   ├── create/
│   │   └── route.ts           ❌ BACKEND - Create product
│   ├── import/
│   │   └── route.ts           ❌ BACKEND - Bulk import
│   └── [productId]/
│       └── route.ts           ❌ BACKEND - Update/Delete product
│
├── orders/
│   ├── create/
│   │   └── route.ts           ❌ BACKEND - Create order
│   └── [orderId]/
│       └── status/
│           └── route.ts       ❌ BACKEND - Update order status
│
├── store/
│   ├── theme/
│   │   └── route.ts           ❌ BACKEND - Update theme
│   └── settings/
│       └── route.ts           ❌ BACKEND - Update settings
│
├── content/
│   └── update/
│       └── route.ts           ❌ BACKEND - Update content
│
├── team/
│   ├── invite/
│   │   └── route.ts           ❌ BACKEND - Invite team member
│   └── remove/
│       └── route.ts           ❌ BACKEND - Remove team member
│
├── chatbot/
│   └── query/
│       └── route.ts           ❌ BACKEND - Process chatbot query
│
└── bloompilot/
    ├── analyze/
    │   └── route.ts           ❌ BACKEND - Analyze & recommend
    └── recommendation/
        └── approve/
            └── route.ts       ❌ BACKEND - Approve recommendation
```

### `lib/` - Backend Business Logic

```
lib/                            ❌ BACKEND - Server utilities
├── auth.ts                    ❌ BACKEND - Auth helpers
├── db.ts                      ❌ BACKEND - Database client
├── tenant.ts                  ❌ BACKEND - Multi-tenant helpers
├── security.ts                ❌ BACKEND - Security utilities
├── validations.ts             ❌ BACKEND - Zod schemas
├── constants.ts               ❌ BACKEND - App constants
├── themes.ts                  ❌ BACKEND - Theme configs
├── cart.ts                    🔄 SHARED - Cart logic (used client-side)
├── utils.ts                   🔄 SHARED - Utility functions
├── import-products.ts         ❌ BACKEND - Product import logic
├── demo-products.ts           ❌ BACKEND - Demo data generator
├── chatbot-tools.ts           ❌ BACKEND - Chatbot data tools
└── bloompilot-engine.ts       ❌ BACKEND - BloomPilot AI engine
```

### Database & ORM

```
prisma/                         ❌ BACKEND - Database
├── schema.prisma              ❌ BACKEND - Database schema
└── seed.ts                    ❌ BACKEND - Seed script
```

### Middleware & Config

```
├── middleware.ts              ❌ BACKEND - Auth middleware
└── next.config.js             ❌ BACKEND - Next.js config
```

---

## 🔄 SHARED (Used by Both)

```
├── types/
│   └── next-auth.d.ts         🔄 SHARED - TypeScript types
├── package.json               🔄 SHARED - Dependencies
├── tsconfig.json              🔄 SHARED - TypeScript config
└── .env.local                 ❌ BACKEND - Environment variables
```

---

## 📊 Quick Summary

### Frontend Files (UI/Client)
- **Location:** `app/**/*.tsx` (except `app/api/**`)
- **Also:** `components/**/*.tsx`
- **Purpose:** React components, pages, layouts, user interface
- **Runs on:** Browser (client-side)

### Backend Files (API/Server)
- **Location:** `app/api/**/*.ts`
- **Also:** `lib/**/*.ts`, `prisma/**/*`, `middleware.ts`
- **Purpose:** API routes, database logic, authentication, business logic
- **Runs on:** Server (Vercel/Node.js)

---

## 💡 Understanding Next.js 14 Structure

### Why Are They Mixed?

Next.js 14 uses **file-system based routing**:

1. **Frontend Pages:** Any `page.tsx` in `app/` (except `app/api/`)
2. **Backend APIs:** Any `route.ts` in `app/api/`
3. **Server Components:** `page.tsx` files can fetch data server-side
4. **Client Components:** Components marked with `'use client'`

### Convention Rules:

```typescript
// ✅ FRONTEND - Server Component (default in app/)
export default async function Page() {
  const data = await fetchData() // Server-side
  return <div>{data}</div>
}

// ✅ FRONTEND - Client Component (interactive)
'use client'
export function Button() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

// ❌ BACKEND - API Route
export async function POST(request: Request) {
  // Server-only code
  return Response.json({ success: true })
}
```

---

## 🎯 File Counts

### Frontend
- **Pages:** ~30 pages (landing, auth, dashboard, storefront)
- **Components:** ~40 components
- **Total Frontend Files:** ~70 files

### Backend
- **API Routes:** ~15 routes
- **Business Logic:** ~10 lib files
- **Database:** Schema + seed
- **Total Backend Files:** ~27 files

---

## 🔍 How to Identify at a Glance

| File Type | Location | Purpose |
|-----------|----------|---------|
| `page.tsx` | `app/` | ✅ FRONTEND - UI page |
| `layout.tsx` | `app/` | ✅ FRONTEND - Layout wrapper |
| `route.ts` | `app/api/` | ❌ BACKEND - API endpoint |
| `*.tsx` | `components/` | ✅ FRONTEND - React component |
| `*.ts` | `lib/` | ❌ BACKEND - Server logic |
| `schema.prisma` | `prisma/` | ❌ BACKEND - Database schema |

---

## 📝 Want a Reorganized Structure?

If you prefer a clearer separation, you could reorganize like this:

```
src/
├── frontend/           # Move here
│   ├── components/
│   ├── app/ (pages only)
│   └── styles/
│
└── backend/            # Move here
    ├── api/
    ├── lib/
    ├── prisma/
    └── middleware/
```

But **Next.js convention is to keep the current structure** because:
1. Easier to navigate (all routes in `app/`)
2. Better IDE support
3. Automatic code splitting
4. Standard for Next.js apps

---

**Current structure follows Next.js 14 best practices!** The mixing is intentional and actually makes the codebase more maintainable. 🚀
