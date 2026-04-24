# Motorcycle Parts Inventory and Sales Management System
### Product Requirements Document (PRD)

---

## Overview

**Product Name:** MotoStock PH  
**Type:** Web-based Inventory and Sales Management System  
**Target User:** Single-store motorcycle parts seller in the Philippines  
**Stack:** Next.js (App Router) · Supabase · Tailwind CSS · Vercel  
**Goal:** A practical, production-quality system that handles daily inventory and sales operations for a small business, while serving as a strong final project demonstrating CRUD, relational data, authentication, and reporting.

---

## Problem Statement

Small motorcycle parts sellers in the Philippines typically manage stock through handwritten logs or basic spreadsheets. This leads to:

- Lost track of low-stock items until they run out
- No visibility into daily or weekly sales performance
- Manual, error-prone stock counting
- No history of supplier purchases or stock movements

MotoStock PH solves this with a clean, fast, browser-based system that any store owner or staff can use without technical training.

---

## Users

| Role | Description |
|------|-------------|
| Admin | Full access — manages products, suppliers, users, reports |
| Staff | Can record sales and stock movements; read-only on reports |

---

## MVP Feature Scope

### Phase 1 — Core Foundation
- [ ] Authentication (login / logout via Supabase Auth)
- [ ] Dashboard with key metrics
- [ ] Products CRUD (add, edit, delete, view)
- [ ] Categories and Brands management
- [ ] Stock In / Stock Out recording
- [ ] Low-stock alerts on dashboard

### Phase 2 — Sales and Suppliers
- [ ] Sales recording (walk-in transactions)
- [ ] Automatic stock deduction on sale
- [ ] Sale items breakdown (multi-item per sale)
- [ ] Suppliers list CRUD
- [ ] Purchase history per supplier

### Phase 3 — Reports and Polish
- [ ] Daily sales report
- [ ] Top-selling parts report
- [ ] Low-stock report
- [ ] Inventory valuation report
- [ ] Printable invoice / sales summary
- [ ] Export to CSV
- [ ] Audit log for stock movements

---

## Functional Requirements

### Authentication
- Login page with email + password via Supabase Auth
- Role-based access: `admin` and `staff`
- Protected routes — redirect unauthenticated users to login
- Session persistence across page refreshes

### Dashboard
- Total products count
- Low-stock items count (quantity ≤ reorder level)
- Out-of-stock items count (quantity = 0)
- Today's total sales (peso value)
- Recent stock movements (last 10 entries)
- Quick-access links to common actions

### Products Module
- List all products with search and filter (by category, brand, stock status)
- Add / Edit product form with fields:
  - Part name
  - SKU / item code
  - Brand (linked to brands table)
  - Category (linked to categories table)
  - Compatible motorcycle model (text)
  - Cost price (PHP)
  - Selling price (PHP)
  - Stock quantity
  - Reorder level (threshold for low-stock alert)
- Soft delete (archive) products
- Product detail page with movement history

### Stock Movement Module
- Record stock-in (from supplier)
- Record stock-out (manual, e.g. damaged or lost)
- Sales automatically create a `sale` type movement
- Movement log: product, type, quantity, note, timestamp, recorded by

### Sales Module
- Create new sale transaction
- Add multiple line items (product + quantity)
- Auto-fills selling price from product record
- Computes subtotal and total
- Optional customer name field
- On save: deducts stock, creates movement records, saves sale
- View past sales with date filter

### Suppliers Module
- Supplier list: name, contact number, address, notes
- Add / Edit / Delete suppliers
- View purchase history per supplier (stock-in records linked to supplier)

### Reports Module
- Date-range filter on all reports
- Daily sales summary (total transactions, total revenue)
- Top-selling parts (by quantity sold)
- Low-stock report (all products at or below reorder level)
- Inventory valuation (sum of cost_price × stock_quantity)
- Print view / export to CSV

---

## Non-Functional Requirements

- **Performance:** Page loads under 2 seconds on standard Philippine mobile internet
- **Responsiveness:** Functional on desktop and tablet; mobile-friendly for staff use
- **Security:** Row-level security (RLS) on all Supabase tables
- **Accessibility:** Sufficient color contrast, keyboard-navigable forms
- **Maintainability:** Clean component structure, reusable hooks, typed with TypeScript

---

## Database Schema

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | FK to auth.users |
| full_name | text | |
| role | text | `admin` or `staff` |
| created_at | timestamptz | |

### `categories`
| Column | Type |
|--------|------|
| id | uuid |
| name | text |
| created_at | timestamptz |

### `brands`
| Column | Type |
|--------|------|
| id | uuid |
| name | text |
| created_at | timestamptz |

### `suppliers`
| Column | Type |
|--------|------|
| id | uuid |
| name | text |
| contact_number | text |
| address | text |
| notes | text |
| created_at | timestamptz |

### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| name | text | |
| sku | text | unique |
| brand_id | uuid | FK brands |
| category_id | uuid | FK categories |
| motorcycle_model | text | |
| cost_price | numeric | |
| selling_price | numeric | |
| stock_quantity | integer | |
| reorder_level | integer | |
| is_archived | boolean | default false |
| created_at | timestamptz | |

### `stock_movements`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| product_id | uuid | FK products |
| type | text | `stock_in`, `sale`, `adjustment` |
| quantity | integer | positive = in, negative = out |
| note | text | |
| supplier_id | uuid | FK suppliers, nullable |
| sale_id | uuid | FK sales, nullable |
| created_by | uuid | FK profiles |
| created_at | timestamptz | |

### `sales`
| Column | Type |
|--------|------|
| id | uuid |
| customer_name | text |
| total_amount | numeric |
| created_by | uuid |
| created_at | timestamptz |

### `sale_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| sale_id | uuid | FK sales |
| product_id | uuid | FK products |
| quantity | integer | |
| unit_price | numeric | price at time of sale |
| subtotal | numeric | |

---

## Out of Scope (v1)
- Multi-branch / multi-store support
- Barcode scanner integration
- Online storefront / e-commerce
- Customer accounts / loyalty system
- Automated reorder purchasing
- SMS/email notifications

---

## Success Criteria
- Admin can log in and manage the full product catalog
- Staff can record a sale and see stock update immediately
- Dashboard reflects real-time inventory status
- Low-stock alerts surface products that need restocking
- Reports generate correctly for a selected date range
- System is deployable on Vercel free tier with Supabase free tier
