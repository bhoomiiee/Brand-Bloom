# BrandBloom - Multi-Tenant E-Commerce Platform

**Launch Your Store Without Writing Code**

BrandBloom is a comprehensive multi-tenant e-commerce platform that enables small business owners to create, publish, and manage professional online stores without technical knowledge. Built for the Cypher 4.0 / MyStartupWave hackathon.

## 🌟 Key Features

### For Store Owners
- **Guided Onboarding Wizard** - Step-by-step store setup with validation
- **Product Management** - Add products via CSV/Excel upload or sample data generation
- **Theme System** - 4+ distinct themes with live preview
- **Unique Storefront** - Each store gets its own URL (path-based routing)
- **Complete Commerce** - Homepage, categories, products, search, filters, cart & checkout
- **Dashboard Analytics** - Sales summary, order tracking, revenue, low-stock alerts
- **Content Editor** - Customize logo, banners, colors, fonts without code
- **Order Management** - Track order status with customer notifications
- **Team & Roles** - Owner and staff roles with permission controls
- **AI Chatbot** - Ask questions about your store data in plain language

### Signature Innovation: BloomPilot
An AI-assisted business growth feature that:
- Analyzes store performance metrics
- Identifies opportunities with evidence-based recommendations
- Proposes specific improvements with preview
- Requires owner approval before any changes
- Measures outcomes and tracks results

### Security & Privacy
- **Multi-Tenant Isolation** - Complete data separation between stores
- **Role-Based Access** - Owner/staff permissions enforced server-side
- **Privacy-First** - Platform admin cannot access customer personal data
- **Audit Trail** - All sensitive actions are logged

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js with role-based access
- **Storage**: Supabase Storage / Cloudinary
- **Forms**: React Hook Form + Zod validation
- **Import**: PapaParse + SheetJS (xlsx)
- **Charts**: Recharts
- **AI**: Claude API (Anthropic)
- **Email**: Resend
- **Deployment**: Vercel

## 📋 Official Challenge Checklist

- [ ] 1. Onboarding form with validation
- [ ] 2. Category selection (predefined + custom)
- [ ] 3. Dummy product import (one-click sample data)
- [ ] 4. Excel/CSV upload with validation
- [ ] 5. Theme selection (4+ themes with live preview)
- [ ] 6. Unique live URL per store
- [ ] 7. Complete storefront (homepage, categories, products, search, cart, checkout)
- [ ] 8. Admin dashboard with metrics
- [ ] 9. Full content control (no-code customization)
- [ ] 10. Product/inventory management
- [ ] 11. Order management with status updates
- [ ] 12. Multi-tenant isolation with roles
- [ ] 13. Owner AI chatbot with store data
- [ ] 14. Chatbot safety and honesty
- [ ] 15. Responsive UI (mobile, tablet, desktop)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BrandBloom
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database URL and other required keys.

4. Set up the database:
```bash
npm run db:generate
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
BrandBloom/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (storefront)/      # Public storefronts
│   ├── dashboard/         # Store owner portal
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── onboarding/       # Onboarding wizard
│   ├── dashboard/        # Dashboard components
│   └── storefront/       # Storefront components
├── lib/                   # Utilities and helpers
│   ├── db.ts             # Database client
│   ├── auth.ts           # Authentication config
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Zod schemas
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema
└── public/               # Static assets
```

## 🔒 Security & Privacy Model

### Three User Types

1. **Store Owner** - Full control over their store, products, orders, customers, and analytics
2. **Staff** - Limited access to assigned store operations (defined by owner)
3. **Customer** - Browses and purchases from storefronts

### Data Isolation Rules

- Every tenant-owned record has a non-null `store_id`
- Server-side authorization on every request
- Database row-level security (RLS) as additional layer
- Chatbot only accesses current store's permitted data
- Cross-store access attempts are logged and denied

## 🎨 Theme System

BrandBloom includes 4+ professionally designed themes:
- **Modern** - Clean, minimalist design
- **Classic** - Traditional e-commerce layout
- **Bold** - High-impact visuals
- **Elegant** - Sophisticated typography

Each theme supports full customization:
- Colors, fonts, layouts
- Logo, banners, hero sections
- Footer and contact information
- Preview before publish

## 📊 BloomPilot AI Assistant

BloomPilot uses store performance data to:

1. **Analyze** - Review product views, orders, revenue trends
2. **Recommend** - Present specific opportunities with evidence
3. **Preview** - Show proposed changes before applying
4. **Approve** - Owner confirms before any live changes
5. **Measure** - Track baseline vs. outcome with honest reporting

**Safety Controls:**
- Read-only database access
- Structured, allow-listed operations
- No arbitrary code execution
- Transparent evidence and reasoning
- Admits when data is insufficient

## 🧪 Testing

Run tests:
```bash
npm test
```

Run end-to-end tests:
```bash
npm run test:e2e
```

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## 📝 Development Roadmap

### Phase 1 - Foundation ✓
- [x] Next.js setup
- [ ] Database schema
- [ ] Authentication

### Phase 2 - Core Features
- [ ] Onboarding wizard
- [ ] Product import
- [ ] Theme system
- [ ] Storefront

### Phase 3 - Owner Portal
- [ ] Dashboard
- [ ] Product management
- [ ] Order management
- [ ] Content editor

### Phase 4 - AI & Advanced
- [ ] Store chatbot
- [ ] BloomPilot recommendations
- [ ] Multi-tenant security

### Phase 5 - Polish
- [ ] Responsive design
- [ ] Testing
- [ ] Demo preparation

## 🤝 Contributing

This is a hackathon project. For team collaboration:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 🎯 Demo Credentials

(Will be added after seeding demo data)

## 📧 Contact

For questions about this project, please contact the BrandBloom team.

---

**Built for Cypher 4.0 / MyStartupWave Hackathon**

*Empowering small businesses to grow online*
