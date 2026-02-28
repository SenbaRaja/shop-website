# 🗄️ STOCKMATE PRO - DATABASE QUICK SETUP

## 📊 Database Tables at a Glance

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          STOCKMATE PRO ER DIAGRAM                            │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   CATEGORIES        │
├─────────────────────┤
│ id (PK)             │◄─────┐
│ name                │      │
│ description         │      │
│ is_active           │      │
└─────────────────────┘      │
                             │
                        has many
                             │
┌─────────────────────┐      │
│   PRODUCTS          │◄─────┘
├─────────────────────┤
│ id (PK)             │
│ name                │
│ sku (UNIQUE)        │
│ category_id (FK)    │
│ cost_price          │
│ mrp                 │
│ selling_price       │
└─────────────────────┘
        │
        │ 1:1 has
        ▼
┌─────────────────────┐        ┌──────────────────┐
│   INVENTORY         │        │ STOCK_MOVEMENTS  │
├─────────────────────┤        ├──────────────────┤
│ product_id (FK)     │◄───────│ product_id (FK)  │
│ current_stock       │        │ movement_type    │
│ reorder_level       │        │ quantity         │
│ warehouse_location  │        │ reference_type   │
│ last_counted_at     │        │ reference_id     │
└─────────────────────┘        │ created_by       │
                               │ created_at       │
                               └──────────────────┘

┌──────────────────────┐                    ┌──────────────────────┐
│   CUSTOMERS          │                    │    SUPPLIERS         │
├──────────────────────┤                    ├──────────────────────┤
│ id (PK)              │                    │ id (PK)              │
│ name                 │                    │ name                 │
│ phone (UNIQUE)       │                    │ contact_person       │
│ email                │                    │ phone (UNIQUE)       │
│ address              │                    │ email                │
│ credit_limit         │                    │ bank_account_number  │
│ total_spent          │                    │ outstanding_payable  │
│ outstanding_dues     │                    │ gstin                │
└──────────────────────┘                    └──────────────────────┘
        │                                             │
        │ 1:many                                 1:many
        ▼                                             ▼
┌──────────────────────┐                    ┌──────────────────────┐
│   SALES              │                    │    PURCHASES         │
├──────────────────────┤                    ├──────────────────────┤
│ id (PK)              │                    │ id (PK)              │
│ bill_number (UNIQUE) │                    │ po_number (UNIQUE)   │
│ customer_id (FK)     │                    │ supplier_id (FK)     │
│ created_by           │                    │ subtotal             │
│ subtotal             │                    │ gst_amount           │
│ gst_amount           │                    │ total_amount         │
│ total_amount         │                    │ expected_delivery    │
│ payment_method       │                    │ received_date        │
│ status               │                    │ status               │
│ bill_date            │                    │ po_date              │
└──────────────────────┘                    └──────────────────────┘
        │                                             │
        │ 1:many                                 1:many
        ▼                                             ▼
┌──────────────────────┐                    ┌──────────────────────┐
│   SALE_ITEMS         │◄─────┐             │  PURCHASE_ITEMS      │◄────┐
├──────────────────────┤      │             ├──────────────────────┤     │
│ sale_id (FK)         │      │             │ purchase_id (FK)     │     │
│ product_id (FK)      │ many │             │ product_id (FK)      │many │
│ quantity             │  ├──┤             │ quantity             │  ├─┤
│ unit_price           │      │             │ unit_cost            │     │
│ line_total           │      │             │ received_quantity    │     │
└──────────────────────┘      │             └──────────────────────┘     │
                             ┌────────────────────────────────────────┘
                             │
                      references PRODUCTS

PAYMENT TRACKING:

Customer Payments Flow:
CUSTOMERS ◄──1:many── CUSTOMER_PAYMENTS
Sales ◄──1:many── CUSTOMER_PAYMENTS
(Auto-updates outstanding_dues via TRIGGER)

Supplier Payments Flow:
SUPPLIERS ◄──1:many── SUPPLIER_PAYMENTS
PURCHASES ◄──1:many── SUPPLIER_PAYMENTS
(Tracks payables)

REPORTING & AUDITING:

ACTIVITY_LOG
├─ Tracks all changes (CREATE/UPDATE/DELETE)
├─ Logs user, time, and changes
└─ Prevents fraud & ensures compliance

DAY_CLOSINGS
├─ One record per day
├─ Reconciles all sales
└─ Tracks cash drawer

REPORTS (CACHED)
├─ Daily summaries
├─ Inventory reports
└─ P&L statements
```

---

## ✅ DATABASE CHECKLIST

### What You Get With This Schema:

```
CORE OPERATIONS:
✅ Create/Edit/Delete products
✅ Track inventory in real-time
✅ Create bills with multiple items  
✅ Track customer payments
✅ Create purchase orders
✅ Track supplier payments
✅ Log all stock movements
✅ Generate daily sales reports
✅ Calculate profit & loss
✅ Track overdue customer dues
✅ Track outstanding supplier payables
✅ Audit trail for compliance
✅ Prevent fraud detection

CONSTRAINTS & VALIDATIONS:
✅ Unique SKU per product
✅ Unique phone numbers
✅ Price validations  
✅ Stock quantity checks
✅ Data integrity via foreign keys
✅ Automatic timestamps
✅ Automatic calculations (via triggers)

PERFORMANCE:
✅ 30+ indexes for fast queries
✅ Views for instant reports
✅ Normalized structure (no duplication)
✅ Optimized for 100K+ records
```

---

## 🚀 QUICK IMPLEMENTATION STEPS

### Step 1: Create AWS RDS Instance (Recommended)

```bash
# Using AWS Console or CLI
aws rds create-db-instance \
  --db-instance-identifier stockmate-pro-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username stockmate \
  --master-user-password YourStrongPassword!123 \
  --allocated-storage 20 \
  --region ap-south-1
```

### Step 2: Connect to Database

```bash
# Install PostgreSQL client
sudo apt-get install postgresql-client

# Connect to AWS RDS
psql -h your-rds-endpoint.rds.amazonaws.com \
     -U stockmate \
     -d stockmate_pro
```

### Step 3: Run Schema

```bash
# Copy entire SQL from DATABASE_BACKEND_SCHEMA.sql
# Paste into psql and run
# OR run directly from file

psql -h your-rds-endpoint.rds.amazonaws.com \
     -U stockmate \
     -d stockmate_pro \
     -f DATABASE_BACKEND_SCHEMA.sql
```

### Step 4: Verify Setup

```sql
-- Run these in psql to verify

-- Count tables (should be 15)
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Count views (should be 3)
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'VIEW';

-- List all tables
\dt

-- Verify triggers created
SELECT * FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

---

## 📱 API ENDPOINTS YOU'LL NEED

Based on the database schema, create these endpoints:

### Products
```
POST   /api/products                    - Create product
GET    /api/products                    - List all products
GET    /api/products/:id                - Get product details
PUT    /api/products/:id                - Update product
DELETE /api/products/:id                - Delete product
GET    /api/products/sku/:sku           - Find by SKU
GET    /api/products/low-stock          - Get low stock items
```

### Inventory
```
GET    /api/inventory/:product_id       - Get stock level
POST   /api/inventory/adjust            - Adjust stock
GET    /api/inventory/movements         - Stock history
```

### Customers
```
POST   /api/customers                   - Create customer
GET    /api/customers                   - List customers
GET    /api/customers/:id               - Get details
PUT    /api/customers/:id               - Update
GET    /api/customers/outstanding       - Get dues
```

### Sales/Billing
```
POST   /api/sales                       - Create bill
GET    /api/sales                       - List bills
GET    /api/sales/:id                   - Get bill details
GET    /api/sales/daily-summary         - Daily sales
POST   /api/sales/:id/payment           - Record payment
```

### Suppliers
```
POST   /api/suppliers                   - Add supplier
GET    /api/suppliers                   - List suppliers
GET    /api/suppliers/:id               - Get details
PUT    /api/suppliers/:id               - Update
```

### Purchases
```
POST   /api/purchases                   - Create PO
GET    /api/purchases                   - List POs
GET    /api/purchases/:id               - Get PO details
PUT    /api/purchases/:id               - Update/Receive
```

### Reports
```
GET    /api/reports/daily-sales         - Daily sales
GET    /api/reports/inventory           - Inventory value
GET    /api/reports/profit-loss         - P&L
GET    /api/reports/customer-dues       - Customer dues
GET    /api/reports/supplier-payables   - Supplier payments due
```

---

## 🔗 Frontend-Backend Integration Flow

### Admin Creates Product
```
1. Frontend: Admin clicks "Add Product"
2. Form submits to: POST /api/products
3. Backend: 
   - Validates data
   - Inserts into products table
   - Creates inventory record
   - Logs to activity_log
4. Frontend: Shows success, refreshes list
```

### Cashier Creates Bill
```
1. Frontend: Cashier adds items to cart
2. Clicks "Complete Sale"
3. POST /api/sales with items
4. Backend:
   - Creates sales record
   - Creates sale_items records
   - Calculates GST automatically
   - Triggers auto-create stock_movements
   - Triggers auto-update inventory
   - Logs to activity_log
5. Frontend: Show bill, print option
```

### Customer Payment
```
1. Frontend: Admin records payment
2. POST /api/customers/:id/payment
3. Backend:
   - Creates customer_payments record
   - Trigger auto-updates customers.outstanding_dues
   - Logs to activity_log
4. Frontend: Updates customer balance
```

---

## 💡 PRO TIPS

1. **Always use transactions for multi-step operations**
   ```sql
   BEGIN;
   -- Create sale
   -- Create sale_items
   -- Update inventory
   COMMIT; -- or ROLLBACK if error
   ```

2. **Use views for reporting queries**
   - Query `daily_sales_summary` instead of joining 3 tables
   - Much faster and simpler

3. **Check stock before creating bill**
   ```sql
   SELECT current_stock FROM inventory 
   WHERE product_id = ? 
   FOR UPDATE; -- Lock to prevent race condition
   ```

4. **Always log who made the change**
   - Store user email with every record
   - Track IP address in activity_log

5. **Use prepared statements always**
   - Prevents SQL injection
   - Better performance

---

## 🎯 TESTING WITH SAMPLE DATA

```sql
-- Insert test data
INSERT INTO categories (name) VALUES ('Electronics');
INSERT INTO products (name, sku, category_id, cost_price, mrp) 
VALUES ('Test Product', 'TST-001', 1, 100, 200);
INSERT INTO inventory (product_id, current_stock) 
VALUES (1, 50);
INSERT INTO customers (name, phone, email) 
VALUES ('Test Customer', '9999999999', 'test@test.com');

-- Test creating a bill
INSERT INTO sales (bill_number, customer_id, created_by, subtotal, total_amount, status, bill_date)
VALUES ('BL-TEST-001', 1, 'test@test.com', 200, 236, 'COMPLETED', CURRENT_DATE);

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, line_total)
VALUES (1, 1, 1, 200, 200);

-- Check results
SELECT * FROM daily_sales_summary;
SELECT * FROM stock_movements;
SELECT * FROM inventory_valuation;
```

---

## 📞 NEXT STEPS

1. ✅ **Database Setup** - Set up PostgreSQL/AWS RDS
2. ✅ **Run Schema** - Execute DATABASE_BACKEND_SCHEMA.sql
3. 🔄 **Build APIs** - Create backend endpoints
4. 🔄 **Frontend Integration** - Connect React to APIs
5. 🔄 **Testing** - Test all flows
6. 🔄 **Deployment** - Deploy to production

---

**You now have a production-ready database schema! 🎉**

For detailed implementation guide, see: `DATABASE_BACKEND_IMPLEMENTATION.md`
