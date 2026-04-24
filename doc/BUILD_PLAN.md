# MotoStock PH — Detailed Build Plan

> **AI Agent Instructions:**
> After completing **any step** in this document, immediately update the checkbox from `[ ]` to `[x]` in this file.
> Mark steps as complete **as soon as they are done**, not at the end of a phase.
> Do not skip ahead without marking completed steps. This file is the single source of truth for build progress.

---

## Design Philosophy

> Apply consistently across all UI work.

- Layout is built with **whitespace, typography, alignment, and scale** — not cards or containers
- Every section has a **distinct structure** — no two sections repeat the same pattern
- Boxes are used **only when functionally necessary** (forms, data tables, metric displays)
- Typography is the primary hierarchy tool — one dominant element per section
- Tone: **modern, spacious, editorial, slightly industrial** — fitting for a motorcycle parts business
- No soft shadows, no pill badges, no stacked card-on-card layouts
- Color palette: deep charcoal + off-white + a single sharp accent (e.g. amber or electric blue)
- Font pairing: strong geometric display font + clean monospace or humanist body font

---

## Phase 0 — Project Setup

### 0.1 Repository and Tooling
- [ ] Initialize Next.js project with App Router: `npx create-next-app@latest motostock-ph --typescript --tailwind --app`
- [x] Install dependencies: `shadcn/ui`, `recharts`, `lucide-react`, `@supabase/supabase-js`, `@supabase/ssr`
- [ ] Set up `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Configure `tailwind.config.ts` with custom design tokens (colors, fonts, spacing scale)
- [x] Set up global CSS variables in `app/globals.css` for the design system
- [x] Install and configure Google Fonts (display + body font pairing) via `next/font`
- [x] Set up `tsconfig.json` path aliases (`@/components`, `@/lib`, `@/hooks`, `@/types`)
- [x] Create `.eslintrc` and `prettier.config.js` for code consistency
- [ ] Initialize Git repository and push to GitHub

### 0.2 Supabase Project
- [ ] Create Supabase project at supabase.com
- [ ] Enable Email auth provider in Authentication settings
- [ ] Run SQL migrations for all tables (see schema in PRD)
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Write RLS policies:
  - `profiles`: users can read/update their own row; admin can read all
  - `products`: authenticated users can read; admin can write
  - `stock_movements`: authenticated users can read; staff and admin can insert
  - `sales` / `sale_items`: same as stock_movements
  - `categories`, `brands`, `suppliers`: admin write, authenticated read
- [x] Create Supabase client utility: `lib/supabase/client.ts` (browser client)
- [x] Create Supabase server utility: `lib/supabase/server.ts` (server component client)
- [x] Create Supabase proxy utility: `proxy.ts` for session refresh on every request
- [ ] Seed database with sample categories, brands, and 10 sample products for development

### 0.3 Type Definitions
- [ ] Generate TypeScript types from Supabase schema: `supabase gen types typescript`
- [ ] Save to `types/database.types.ts`
- [ ] Create domain types in `types/index.ts` (e.g. `Product`, `Sale`, `StockMovement` with joined fields)

---

## Phase 1 — Authentication

### 1.1 Auth Flow
- [x] Create `/app/(auth)/login/page.tsx` — login page
- [x] Build `LoginForm` component in `components/auth/LoginForm.tsx`
  - Email + password fields
  - Error state display
  - Loading state on submit button
  - Calls Supabase `signInWithPassword`
  - Redirects to `/dashboard` on success
- [x] Create server action `actions/auth.ts` with `signIn` and `signOut` functions
- [x] Create `/app/(auth)/layout.tsx` — centered, full-screen auth layout with brand mark
- [x] Implement proxy route protection: unauthenticated → redirect to `/login`
- [x] Implement post-login redirect: authenticated → redirect away from `/login`

### 1.2 User Session
- [x] Create `hooks/useUser.ts` — returns current user and profile from context
- [x] Create `context/UserContext.tsx` — provides user + profile to client components
- [x] Fetch `profiles` row on login and store in context
- [x] Handle missing profile gracefully (create one if not found)

### 1.3 Auth UI Design
- [x] Login page: full-bleed split layout — left side brand/tagline, right side form
- [x] No card container around the form — form fields float on whitespace
- [x] Strong typographic treatment for the brand name
- [x] Subtle animated detail (e.g. slow background texture shift or single decorative line)

---

## Phase 2 — Layout and Navigation

### 2.1 App Shell
- [x] Create `/app/(app)/layout.tsx` — protected app layout wrapping all dashboard pages
- [x] Build `Sidebar` component: `components/layout/Sidebar.tsx`
  - Vertical navigation with icon + label
  - Active state indicator (left border accent, not background fill)
  - Collapsible on smaller screens
  - Logo / brand mark at top
  - User name + role at bottom with sign-out button
- [x] Build `TopBar` component: `components/layout/TopBar.tsx`
  - Page title (dynamic per route)
  - Optional breadcrumb
  - No heavy background — just a clean horizontal separator or whitespace boundary
- [x] Create `components/layout/PageHeader.tsx` — reusable page title + subtitle + optional action button

### 2.2 Design System Components
- [x] Create `components/ui/DataTable.tsx` — clean table with sort support, no heavy borders
- [x] Create `components/ui/StatusBadge.tsx` — minimal text-based status indicator (no pills)
- [x] Create `components/ui/EmptyState.tsx` — typographic empty state, no illustration clutter
- [x] Create `components/ui/ConfirmDialog.tsx` — accessible modal for destructive actions
- [x] Create `components/ui/PageLoader.tsx` — minimal skeleton or spinner
- [x] Create `components/ui/FormField.tsx` — label + input wrapper with error display
- [ ] Establish consistent spacing: use `gap-`, `py-`, `px-` scales defined in design tokens

---

## Phase 3 — Dashboard

### 3.1 Metrics and Data
- [x] Create `lib/queries/dashboard.ts` with functions:
  - `getTotalProducts()` — count of non-archived products
  - `getLowStockCount()` — products where `stock_quantity <= reorder_level`
  - `getOutOfStockCount()` — products where `stock_quantity = 0`
  - `getTodaySales()` — sum of `total_amount` for today's sales
  - `getRecentMovements(limit)` — last N stock movements with product name
- [x] All queries use Supabase server client (server components)

### 3.2 Dashboard Page
- [x] Create `/app/(app)/dashboard/page.tsx`
- [x] Metrics row: 4 key numbers displayed as large typographic figures, not inside cards
  - Total Products · Low Stock · Out of Stock · Today's Sales
- [x] Recent Movements section: clean table or list with timestamp, product, type, quantity
- [x] Quick Actions section: text links or minimal buttons to common tasks
- [x] Low Stock alert strip (if any items are low): horizontal list of product names with quantities

### 3.3 Dashboard Design
- [x] Metrics use oversized numerals as the visual anchor — number is the hero, label is secondary
- [x] Section separation via whitespace + a single thin horizontal rule, not containers
- [x] Today's sales in accent color only if value > 0
- [x] Responsive: metrics stack vertically on mobile

---

## Phase 4 — Products Module

### 4.1 Data Layer
- [x] Create `lib/queries/products.ts`:
  - `getProducts(filters)` — with search, category, brand, stock status filters
  - `getProductById(id)` — with joined brand and category
  - `createProduct(data)`
  - `updateProduct(id, data)`
  - `archiveProduct(id)` — sets `is_archived = true`
- [x] Create `actions/products.ts` — server actions wrapping queries with revalidation

### 4.2 Products List Page
- [x] Create `/app/(app)/products/page.tsx`
- [x] Search bar (live filter by name or SKU)
- [x] Filter controls: Category dropdown · Brand dropdown · Stock status toggle
- [x] Products data table with columns: Name, SKU, Brand, Category, Stock Qty, Reorder Level, Selling Price, Status
- [x] Row actions: Edit · Archive
- [x] "Add Product" button linked to `/products/new`

### 4.3 Product Form
- [x] Create `/app/(app)/products/new/page.tsx`
- [x] Create `/app/(app)/products/[id]/edit/page.tsx`
- [x] Build `ProductForm` component: `components/products/ProductForm.tsx`
  - All fields from schema
  - Brand and Category as searchable select (populated from DB)
  - Client-side validation
  - Server action on submit
  - Redirect to products list on success

### 4.4 Product Detail Page
- [x] Create `/app/(app)/products/[id]/page.tsx`
- [x] Display all product info
- [x] Movement history table for this product (last 30 entries)
- [x] Quick stock adjustment button (opens inline form)

### 4.5 Categories and Brands
- [x] Create `/app/(app)/settings/categories/page.tsx` — inline CRUD table
- [x] Create `/app/(app)/settings/brands/page.tsx` — inline CRUD table
- [x] Both use `lib/queries/categories.ts` and `lib/queries/brands.ts`

---

## Phase 5 — Stock Movements

### 5.1 Data Layer
- [x] Create `lib/queries/stockMovements.ts`:
  - `getMovements(filters)` — filter by product, type, date range
  - `createStockIn(data)` — inserts movement, increments product stock
  - `createAdjustment(data)` — inserts adjustment movement, updates stock
- [x] Stock quantity update must be atomic — use a Supabase RPC or transaction
- [x] Create Supabase function `rpc_adjust_stock(product_id, delta, ...)` in SQL

### 5.2 Stock In Form
- [x] Create `components/stock/StockInForm.tsx`
  - Product search/select
  - Quantity
  - Supplier (optional)
  - Note
- [x] Accessible from product detail page and from a top-level "Stock In" quick action

### 5.3 Manual Adjustment Form
- [x] Create `components/stock/AdjustmentForm.tsx`
  - Product select
  - Positive or negative quantity
  - Reason / note (required for adjustments)

### 5.4 Movement History Page
- [x] Create `/app/(app)/movements/page.tsx`
- [x] Full movement log with filters: product, type, date range
- [x] Export to CSV button

---

## Phase 6 — Sales Module

### 6.1 Data Layer
- [x] Create `lib/queries/sales.ts`:
  - `getSales(filters)` — with date range, search by customer
  - `getSaleById(id)` — with joined sale_items and products
  - `createSale(saleData, items[])` — atomic: insert sale + items + stock movements
- [x] Supabase RPC or server-side transaction for atomic sale creation
- [x] Each sale item creates one `stock_movements` record of type `sale`

### 6.2 New Sale Page
- [x] Create `/app/(app)/sales/new/page.tsx`
- [x] Build `SaleForm` component: `components/sales/SaleForm.tsx`
  - Customer name (optional)
  - Dynamic line items: product search → auto-fill price → quantity → subtotal
  - Add/remove line items
  - Running total display
  - Submit creates sale atomically
- [x] After save: redirect to sale detail / receipt view

### 6.3 Sales List Page
- [x] Create `/app/(app)/sales/page.tsx`
- [x] Table: Date, Customer, Items count, Total
- [x] Date range filter
- [x] Click row → sale detail

### 6.4 Sale Detail / Receipt
- [x] Create `/app/(app)/sales/[id]/page.tsx`
- [x] Clean receipt layout: store name, date, line items, total
- [x] Print button (uses `window.print()` with print-only CSS)

---

## Phase 7 — Suppliers Module

### 7.1 Data Layer
- [x] Create `lib/queries/suppliers.ts`:
  - `getSuppliers()`
  - `getSupplierById(id)` — with linked stock_in movements
  - `createSupplier(data)`
  - `updateSupplier(id, data)`
  - `deleteSupplier(id)` — only if no linked movements

### 7.2 Suppliers Pages
- [x] Create `/app/(app)/suppliers/page.tsx` — list with search
- [x] Create `/app/(app)/suppliers/new/page.tsx`
- [x] Create `/app/(app)/suppliers/[id]/page.tsx` — detail + purchase history

---

## Phase 8 — Reports Module

### 8.1 Data Layer
- [x] Create `lib/queries/reports.ts`:
  - `getDailySalesReport(dateRange)` — group sales by day
  - `getTopSellingParts(dateRange, limit)` — sum qty from sale_items
  - `getLowStockReport()` — products at/below reorder level
  - `getInventoryValuation()` — sum of cost_price × stock_quantity

### 8.2 Reports Pages
- [x] Create `/app/(app)/reports/page.tsx` — report selector
- [x] Create `/app/(app)/reports/sales/page.tsx` — daily sales chart + table
- [x] Create `/app/(app)/reports/top-parts/page.tsx` — bar chart + table
- [x] Create `/app/(app)/reports/low-stock/page.tsx` — sortable table
- [x] Create `/app/(app)/reports/valuation/page.tsx` — summary + table

### 8.3 Charts
- [x] Use Recharts for all charts
- [x] `components/charts/SalesBarChart.tsx` — daily sales bar chart
- [x] `components/charts/TopPartsChart.tsx` — horizontal bar chart
- [x] Charts use CSS variable colors to stay on-theme
- [x] All charts have accessible labels and responsive containers

### 8.4 Export
- [x] Add CSV export to each report page using browser-side CSV generation
- [x] No external library needed — build `lib/utils/exportCsv.ts`

---

## Phase 9 — Settings and Polish

### 9.1 Settings
- [x] Create `/app/(app)/settings/page.tsx` — settings hub
- [x] Profile settings: update display name
- [x] Admin only: manage categories, brands
- [x] Admin only: user management (list profiles, change role)

### 9.2 Error Handling
- [x] Create `app/error.tsx` — global error boundary
- [x] Create `app/not-found.tsx` — clean 404 page
- [x] All server actions return typed result objects `{ success, error, data }`
- [x] Toast notifications for all user actions (success + error)
- [x] Create `components/ui/Toast.tsx` or use a lightweight toast library

### 9.3 Loading States
- [x] Skeleton loaders for all data tables
- [x] Suspense boundaries on all async server components
- [x] Optimistic updates on stock adjustments and sales where feasible

### 9.4 Responsive Polish
- [x] Sidebar collapses to bottom nav or hamburger on mobile
- [x] All tables scroll horizontally on small screens
- [x] Forms stack vertically on mobile
- [x] Touch targets meet 44px minimum

---

## Phase 10 — Deployment

### 10.1 Pre-deployment
- [ ] Audit all Supabase RLS policies — test with non-admin user
- [ ] Remove all `console.log` debug statements
- [ ] Set `NEXT_PUBLIC_` env vars for production in Vercel dashboard
- [ ] Test all critical flows end-to-end in production Supabase project

### 10.2 Vercel Deployment
- [ ] Connect GitHub repo to Vercel
- [ ] Set environment variables in Vercel project settings
- [ ] Deploy and verify build succeeds
- [ ] Verify auth flow works on production URL
- [ ] Verify Supabase CORS settings include production URL

### 10.3 Final QA Checklist
- [ ] Login / logout works
- [ ] Add product → appears in list
- [ ] Stock in → quantity increases
- [ ] New sale → stock decreases, sale appears in history
- [ ] Low stock alert shows on dashboard
- [ ] Reports generate correct data
- [ ] Print receipt renders correctly
- [ ] Admin-only routes reject staff users
- [ ] Site is accessible on mobile browser

---

## Code Standards

### File Structure
```
app/
  (auth)/          # login page, auth layout
  (app)/           # all protected pages
    dashboard/
    products/
    sales/
    suppliers/
    movements/
    reports/
    settings/
components/
  auth/
  layout/
  products/
  sales/
  stock/
  charts/
  ui/              # shared design system components
lib/
  supabase/        # client, server, middleware utils
  queries/         # all DB query functions
  utils/           # helpers (formatCurrency, exportCsv, etc.)
actions/           # Next.js server actions
hooks/             # custom React hooks
types/             # TypeScript types
```

### Conventions
- **Naming:** PascalCase for components, camelCase for functions and variables, kebab-case for files
- **Queries:** All database access goes through `lib/queries/` — never raw Supabase calls in components
- **Server Actions:** All mutations go through `actions/` — never call queries directly from client components
- **Types:** All query functions must have explicit TypeScript return types
- **Comments:** Comment the "why", not the "what" — code should be self-documenting
- **Components:** Every component file exports one primary component, named same as the file
- **Reusability:** If UI logic repeats 3+ times, extract to a component or hook

### Currency
- Always store prices as `numeric` in Postgres (not float)
- Display with `lib/utils/format.ts` → `formatPHP(amount)` → `₱1,234.00`

---

## Progress Summary

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Project Setup | 🔄 In Progress |
| 1 | Authentication | ✅ Done |
| 2 | Layout and Navigation | 🔄 In Progress |
| 3 | Dashboard | ✅ Done |
| 4 | Products Module | ✅ Done |
| 5 | Stock Movements | ✅ Done |
| 6 | Sales Module | ✅ Done |
| 7 | Suppliers Module | ✅ Done |
| 8 | Reports Module | ✅ Done |
| 9 | Settings and Polish | ✅ Done |
| 10 | Deployment | ⬜ Not Started |

> Update the status column as phases complete: ⬜ Not Started → 🔄 In Progress → ✅ Done
