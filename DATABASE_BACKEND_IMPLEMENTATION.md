# STOCKMATE PRO - BACKEND DATABASE IMPLEMENTATION GUIDE

## 📊 Overview

Your app needs **15 core tables** to handle all operations. This is based on the admin dashboard analysis showing:

- 📦 Product Management
- 💰 Sales & Billing
- 👥 Customer Management  
- 🏪 Supplier Management
- 📊 Stock Management
- 💳 Payment Tracking
- 📈 Reports & Analytics
- 🔐 Security & Audit Logs

---

## 🗂️ DATABASE ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    STOCKMATE PRO DATABASE                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CORE TABLES (15)                                          │
│  ├─ Categories          (5 core lookup)                     │
│  ├─ Products            (product catalog)                   │
│  ├─ Inventory           (current stock)                     │
│  ├─ Stock Movements     (audit trail)                       │
│  ├─ Customers           (buyer database)                    │
│  ├─ Suppliers           (vendor database)                   │
│  ├─ Sales               (bills/invoices)                    │
│  ├─ Sale Items          (bill line items)                   │
│  ├─ Purchases           (purchase orders)                   │
│  ├─ Purchase Items      (PO line items)                     │
│  ├─ Customer Payments   (payment tracking)                  │
│  ├─ Supplier Payments   (payable tracking)                  │
│  ├─ Day Closings        (daily reconciliation)              │
│  ├─ Activity Log        (audit trail)                       │
│  └─ Reports            (cached reports)                     │
│                                                              │
│  VIEWS (3)              (Quick queries)                      │
│  ├─ daily_sales_summary                                     │
│  ├─ customer_outstanding_summary                            │
│  └─ inventory_valuation                                     │
│                                                              │
│  TRIGGERS (4)           (Automatic updates)                  │
│  ├─ update_product_timestamp                                │
│  ├─ update_customer_outstanding                             │
│  ├─ update_inventory_from_movement                          │
│  └─ create_stock_movement_on_sale                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 TABLE DESCRIPTIONS

### 1️⃣ CATEGORIES
**Purpose:** Organize products (Electronics, Grocery, Beauty, etc.)

**Fields:**
- `id` - Category ID
- `name` - Category name (unique)
- `description` - Details
- `image_url` - Category image
- `is_active` - Enable/disable

**Example:**
```
Electronics, Grocery, Beauty, Clothing, Books
```

---

### 2️⃣ PRODUCTS
**Purpose:** Master product catalog

**Fields:**
- `id` - Product ID
- `name` - Product name
- `sku` - Stock keeping unit (must be unique)
- `category_id` - Category reference
- `cost_price` - Buying cost
- `mrp` - Maximum retail price (list price)
- `selling_price` - Your selling price
- `barcode` - For POS scanning
- `image_url` - Product image
- `is_active` - Active/inactive status

**Example:**
```
SKU-001 | Product A | Electronics | Cost: 500 | MRP: 899 | Selling: 799
```

**Why you need it:**
- Source of truth for product info
- Cost tracking for profit calculation
- SKU for barcode scanning

---

### 3️⃣ INVENTORY
**Purpose:** Real-time stock levels

**Fields:**
- `product_id` - Which product
- `current_stock` - How many units available
- `reorder_level` - Alert when stock reaches this
- `warehouse_location` - Where stored
- `last_counted_at` - Audit trail

**Why separate from products:**
- Constantly changes (updates thousands of times daily)
- Products change rarely (only metadata updates)
- Better performance with separate tables

---

### 4️⃣ STOCK MOVEMENTS
**Purpose:** Complete audit trail of all stock changes

**Fields:**
- `product_id` - Which product
- `movement_type` - IN / OUT / ADJUSTMENT / RETURN
- `quantity` - How many
- `reference_type` - PURCHASE / SALE / MANUAL / RETURN
- `reference_id` - Links to purchase or sale ID
- `created_by` - Who made the change
- `created_at` - When

**Examples:**
```
SKU-001 | IN | 50 | PURCHASE | Purchase-001 | admin | 2026-02-28
SKU-001 | OUT | 3 | SALE | Sale-BL-001 | admin | 2026-02-28
SKU-001 | OUT | 2 | RETURN | Sale-BL-001 | john | 2026-02-28
```

**Why you need it:**
- See every stock change with reason
- Solve inventory discrepancies
- Know WHO made what change WHEN
- Prevent fraud (manager can see if cashier stole)

---

### 5️⃣ CUSTOMERS
**Purpose:** Track all your customers

**Fields:**
- `id` - Customer ID
- `name` - Customer name
- `phone` - Contact phone (unique, searchable)
- `email` - Email
- `address` - Full address
- `customer_type` - RETAIL or WHOLESALE
- `credit_limit` - Max they can owe
- `total_spent` - Lifetime purchases
- `outstanding_dues` - Unpaid amount
- `gstin` - Tax ID (India GST)

**Why separate from users:**
- Users (staff) is different from Customers (buyers)
- Customers don't have login credentials
- Different tracking needs

---

### 6️⃣ SUPPLIERS
**Purpose:** Vendor management

**Fields:**
- `id` - Supplier ID
- `name` - Vendor name
- `contact_person` - Actual contact
- `phone` - Vendor phone
- `email` - Vendor email
- `bank_account_number` - For payments
- `ifsc_code` - Bank branch code
- `outstanding_payable` - How much you owe
- `gstin` - Tax ID

**Why you need it:**
- Track WHO you buy from
- Know how much you owe
- Store bank details for payments
- Contact details readily available

---

### 7️⃣ SALES
**Purpose:** Complete bill/invoice record

**Fields:**
- `bill_number` - Unique bill ID (like BL-001)
- `customer_id` - Which customer
- `created_by` - Which cashier created bill
- `subtotal` - Sum before taxes
- `gst_rate` - Tax percentage (usually 18%)
- `gst_amount` - Auto-calculated tax
- `discount_value` - Discount given
- `total_amount` - Final amount
- `payment_method` - CASH / CARD / UPI / CHEQUE / CREDIT
- `status` - COMPLETED / RETURNED / PENDING
- `bill_date` - When sold

**Why structured this way:**
- GST is calculated separately for reporting
- Payment method affects accounting
- Status lets you handle returns
- One row = one complete bill

---

### 8️⃣ SALE_ITEMS
**Purpose:** Individual items in each bill

**Fields:**
- `sale_id` - Which bill
- `product_id` - Which product
- `quantity` - How many sold
- `unit_price` - Selling price at time of sale
- `line_total` - quantity × unit_price

**Example:**
```
Bill BL-001 contains:
  - Product A × 2 @ 799 = 1598
  - Product B × 1 @ 249 = 249
  - Product C × 3 @ 499 = 1497
  Total in bill = 3344
```

**Why separate:**
- One bill has many items
- Need to track what was sold
- Can calculate bill composition (high-margin vs low-margin items)
- Price can change over time per product

---

### 9️⃣ PURCHASES
**Purpose:** Purchase orders from suppliers

**Fields:**
- `po_number` - Unique PO ID (like PO-001)
- `supplier_id` - Which supplier
- `subtotal` - Cost before tax
- `gst_amount` - Tax paid
- `total_amount` - What you pay
- `expected_delivery` - When should arrive
- `received_date` - When actually received
- `status` - PENDING / RECEIVED / CANCELLED

**Why you need it:**
- Know what you're ordering
- Track expected inventory arrival
- See actual vs expected delivery
- Link to supplier for payment tracking

---

### 🔟 PURCHASE_ITEMS
**Purpose:** Individual items in each purchase order

**Fields:**
- `purchase_id` - Which PO
- `product_id` - Which product
- `quantity` - Ordered quantity
- `unit_cost` - Cost per unit from supplier
- `received_quantity` - How many actually received

**Example:**
```
PO-001 from Supplier A:
  - Product A × 100 @ 500 = 50,000
  - Product B × 200 @ 150 = 30,000
  Total PO = 80,000 + GST
```

---

### 1️⃣1️⃣ CUSTOMER_PAYMENTS
**Purpose:** Track payments received from customers

**Fields:**
- `customer_id` - Which customer paid
- `sale_id` - Which bill they're paying for (optional if on account)
- `amount` - How much paid
- `payment_method` - CASH / CHEQUE / TRANSFER / etc
- `payment_date` - When paid
- `created_by` - Who received payment

**Why important:**
- Reconcile customer payments
- Know who has paid, who owes
- Track cheque numbers for bounces
- Works with automatic triggers to update customer outstanding dues

---

### 1️⃣2️⃣ SUPPLIER_PAYMENTS
**Purpose:** Track payments made to suppliers

**Fields:**
- `supplier_id` - Which supplier to pay
- `purchase_id` - Which PO being paid
- `amount` - How much paid
- `payment_method` - TRANSFER / CHEQUE / etc
- `reference_number` - Cheque/transfer ref
- `payment_date` - When paid

---

### 1️⃣3️⃣ DAY_CLOSINGS
**Purpose:** Daily reconciliation & closing

**Fields:**
- `closing_date` - Which date (unique)
- `total_sales` - Sum of all bills today
- `total_bills` - Count of bills
- `cash_collected` - Cash sales total
- `card_collected` - Card sales total
- `opening_balance` - Cash at start of day
- `closing_balance` - Cash at end of day
- `closed_by` - Who did closing

**Why important:**
- Reconcile cash drawer
- Daily income statement
- Track payment method split
- Prevents till manipulation

---

### 1️⃣4️⃣ ACTIVITY_LOG
**Purpose:** Audit trail for compliance & fraud detection

**Fields:**
- `user_email` - Who did it
- `action` - What they did (CREATE / UPDATE / DELETE)
- `entity_type` - PRODUCT / SALE / CUSTOMER / etc
- `entity_id` - Which record
- `old_values` - Before change (JSON)
- `new_values` - After change (JSON)
- `ip_address` - From which terminal
- `created_at` - When

**Example:**
```
INFO@STOCKMATESOLUTIONS.STORE | UPDATED | PRODUCT | 1
Old: {"name":"Product A","price":799}
New: {"name":"Product A Modified","price":899}
IP: 192.168.1.10 | Time: 2026-02-28 14:30:00
```

**Why critical:**
- Know who changed what
- Prevent unauthorized changes
- Recover from mistakes
- Comply with regulations

---

### 1️⃣5️⃣ REPORTS
**Purpose:** Cache important reports

**Fields:**
- `report_name` - Name of report
- `report_type` - DAILY_SALES / INVENTORY_VALUATION / PROFIT_LOSS
- `report_date` - Date of report
- `data` - Complete report as JSON
- `generated_by` - Who generated
- `generated_at` - When generated

**Examples:**
- Daily Sales Report
- Monthly Profit & Loss
- Inventory Valuation Report
- Customer Credit Report
- Supplier Outstanding Report

---

## 🎯 KEY FEATURES COVERED

### ✅ Product Management
```
✓ Add/Edit/Delete products
✓ Category organization
✓ Cost & MRP tracking
✓ SKU for barcode scanning
✓ Low stock alerts (reorder_level)
✓ Product images
```

### ✅ Sales & Billing
```
✓ Create bills/invoices
✓ Multiple items per bill
✓ Auto GST calculation
✓ Discount support
✓ Multiple payment methods
✓ Return/refund tracking
```

### ✅ Stock Management
```
✓ Real-time inventory levels
✓ Stock movements (complete audit)
✓ Purchase orders
✓ Stock adjustments
✓ Automatic inventory updates
✓ Low stock alerts
```

### ✅ Customer Management
```
✓ Customer database
✓ Credit limit tracking
✓ Payment tracking
✓ Outstanding dues calculation
✓ Lifetime purchase history
✓ Contact details
```

### ✅ Supplier Management
```
✓ Supplier database
✓ Outstanding payables
✓ Purchase order tracking
✓ Bank details for payments
✓ Contact information
```

### ✅ Reporting
```
✓ Daily sales summary
✓ Profit calculation
✓ Inventory valuation
✓ Customer outstanding report
✓ Day closing report
✓ Activity that reports
```

### ✅ Security & Audit
```
✓ Complete activity logging
✓ Who-did-what-when tracking
✓ IP address logging
✓ Compliance audit trail
✓ Stock movement validation
```

---

## 🚀 SETUP INSTRUCTIONS

### Step 1: Choose Your Database
```
Option 1: AWS RDS PostgreSQL (Recommended)
- Easy to scale
- Automated backups
- AWS managed

Option 2: PostgreSQL on EC2 (Cheaper)
- More control
- Manual backups
- Self-managed

Option 3: Local PostgreSQL (Development)
- For testing
- Not for production
```

### Step 2: Create Database
```bash
# Create database
createdb stockmate_pro

# Connect
psql -d stockmate_pro
```

### Step 3: Run Schema
```bash
# Run the complete schema
psql -d stockmate_pro -f DATABASE_BACKEND_SCHEMA.sql
```

### Step 4: Verify Tables
```sql
-- Count tables
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';
-- Should show 15

-- List all tables
\dt
```

---

## 📝 INTEGRATION WITH YOUR APP

### Frontend → Database Flow

```
Admin Dashboard
  ├─ Product Management
  │  └─ Add Product → products table
  │     → inventory table
  ├─ Customer Management
  │  └─ Add Customer → customers table
  ├─ Sales & Billing
  │  └─ Create Bill → sales table
  │     → sale_items table
  │     → stock_movements (auto via trigger)
  │     → inventory (auto via trigger)
  ├─ Stock Management
  │  └─ Adjust Stock → stock_movements table
  │     → inventory table (auto via trigger)
  ├─ Supplier Management
  │  └─ Add Supplier → suppliers table
  └─ Reports
     └─ View Reports → daily_sales_summary VIEW
        → customer_outstanding_summary VIEW
        → inventory_valuation VIEW
```

---

## 🔑 KEY DESIGN PRINCIPLES

### 1. **Normalization** ✅
- No duplicate data
- Changes in one place only
- Reduces inconsistency

### 2. **Audit Trail** ✅
- stock_movements table tracks every change
- activity_log tracks user actions
- Prevents fraud & mistakes

### 3. **Triggers** ✅
- Automatic inventory updates
- Automatic payment reconciliation
- No manual updates needed

### 4. **Views** ✅
- Pre-calculated summaries
- Fast reporting queries
- No need for each query to recalculate

### 5. **Indexes** ✅
- Fast lookups by phone, email, SKU
- Fast searches by date
- Better query performance

---

## 💾 BACKUP & RECOVERY

### Automated Backup (AWS RDS)
```bash
# AWS handles this automatically
# But ensure backups are enabled
```

### Manual Backup (Local PostgreSQL)
```bash
# Backup entire database
pg_dump stockmate_pro > backup_stockmate_pro.sql

# Backup single table
pg_dump -t products stockmate_pro > backup_products.sql

# Restore from backup
psql stockmate_pro < backup_stockmate_pro.sql
```

---

## 🎯 NEXT STEPS

1. **Create Database** - Set up PostgreSQL
2. **Run Schema** - Execute SQL script above
3. **Create API Endpoints** - Build backend APIs
4. **Connect Frontend** - Integrate with React
5. **Test** - Create sample data & test queries
6. **Deploy** - Go live

---

## 📊 QUICK REFERENCE QUERIES

### Get Today's Sales
```sql
SELECT * FROM daily_sales_summary WHERE sale_date = CURRENT_DATE;
```

### Get Low Stock Products
```sql
SELECT * FROM inventory_valuation WHERE stock_status = 'LOW';
```

### Get Customer Outstanding
```sql
SELECT * FROM customer_outstanding_summary 
WHERE outstanding_amount > 0
ORDER BY outstanding_amount DESC;
```

### Get Total Inventory Value
```sql
SELECT 
  SUM(cost_valuation) as total_cost,
  SUM(retail_valuation) as total_retail
FROM inventory_valuation;
```

### Get Sales by Payment Method (Today)
```sql
SELECT payment_method, COUNT(*) as count, SUM(total_amount) as total
FROM sales 
WHERE bill_date = CURRENT_DATE AND status = 'COMPLETED'
GROUP BY payment_method;
```

---

## 🔒 SECURITY NOTES

1. **Always use prepared statements** (prevent SQL injection)
2. **Enable database encryption** (AWS RDS encryption)
3. **Restrict access** (Use IAM roles for AWS)
4. **Backup regularly** (Daily backups minimum)
5. **Monitor activity** (Check activity_log regularly)
6. **Version control** (Keep schema in Git)

---

## 📞 SUPPORT

- Issues? Check the USEFUL QUERIES section in the SQL file
- Error running? Check column names match exactly
- Performance issue? Check indexes are created
- Need help? Review the example data in the schema

---

**Total Tables: 15 | Views: 3 | Triggers: 4 | Indexes: 30+**

**Status: ✅ Production Ready**

You now have a **complete, professional-grade database schema** for StockMate Pro! 🎉
