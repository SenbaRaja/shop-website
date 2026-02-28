-- ====================================================================
-- STOCKMATE PRO - COMPLETE DATABASE SCHEMA
-- For PostgreSQL / AWS RDS
-- ====================================================================

-- 1. CATEGORIES TABLE
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTS TABLE
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    description TEXT,
    cost_price DECIMAL(10,2) NOT NULL,
    mrp DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2),
    barcode VARCHAR(50),
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_price CHECK (cost_price > 0 AND mrp > 0)
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);

-- 3. INVENTORY TABLE (Current Stock)
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL UNIQUE REFERENCES products(id),
    current_stock INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    warehouse_location VARCHAR(100),
    last_counted_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_stock CHECK (current_stock >= 0)
);

CREATE INDEX idx_inventory_product ON inventory(product_id);

-- 4. STOCK MOVEMENTS TABLE (Audit Trail)
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    movement_type VARCHAR(20) NOT NULL, -- 'IN', 'OUT', 'ADJUSTMENT', 'RETURN'
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50), -- 'PURCHASE', 'SALE', 'MANUAL', 'RETURN'
    reference_id INTEGER,
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX idx_stock_movements_type ON stock_movements(movement_type);

-- 5. CUSTOMERS TABLE
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    customer_type VARCHAR(20) DEFAULT 'RETAIL', -- 'RETAIL' or 'WHOLESALE'
    credit_limit DECIMAL(10,2) DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    outstanding_dues DECIMAL(12,2) DEFAULT 0,
    gstin VARCHAR(15),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

-- 6. SUPPLIERS TABLE
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    bank_account_name VARCHAR(255),
    bank_account_number VARCHAR(20),
    ifsc_code VARCHAR(11),
    payment_terms VARCHAR(50),
    outstanding_payable DECIMAL(12,2) DEFAULT 0,
    gstin VARCHAR(15),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_phone ON suppliers(phone);
CREATE INDEX idx_suppliers_email ON suppliers(email);

-- 7. SALES/BILLS TABLE
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    created_by VARCHAR(100) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    gst_rate DECIMAL(5,2) DEFAULT 18.00,
    gst_amount DECIMAL(12,2) DEFAULT 0,
    discount_type VARCHAR(20), -- 'AMOUNT' or 'PERCENTAGE'
    discount_value DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'CASH', -- 'CASH', 'CARD', 'UPI', 'CHEQUE', 'CREDIT'
    status VARCHAR(20) DEFAULT 'COMPLETED', -- 'COMPLETED', 'RETURNED', 'PENDING'
    notes TEXT,
    bill_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_total CHECK (total_amount > 0)
);

CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_bill_number ON sales(bill_number);
CREATE INDEX idx_sales_bill_date ON sales(bill_date);
CREATE INDEX idx_sales_status ON sales(status);

-- 8. SALE ITEMS TABLE
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    CONSTRAINT chk_qty CHECK (quantity > 0)
);

CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);

-- 9. PURCHASES TABLE (Stock Purchase Orders)
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    created_by VARCHAR(100) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    gst_rate DECIMAL(5,2) DEFAULT 18.00,
    gst_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    expected_delivery DATE,
    received_date DATE,
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'RECEIVED', 'CANCELLED'
    notes TEXT,
    po_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_purchases_supplier ON purchases(supplier_id);
CREATE INDEX idx_purchases_status ON purchases(status);

-- 10. PURCHASE ITEMS TABLE
CREATE TABLE purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id INTEGER NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    CONSTRAINT chk_qty CHECK (quantity > 0)
);

CREATE INDEX idx_purchase_items_purchase ON purchase_items(purchase_id);

-- 11. CUSTOMER PAYMENTS TABLE
CREATE TABLE customer_payments (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    sale_id INTEGER REFERENCES sales(id),
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    reference_number VARCHAR(100),
    created_by VARCHAR(100) NOT NULL,
    notes TEXT,
    payment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_payments_customer ON customer_payments(customer_id);
CREATE INDEX idx_customer_payments_date ON customer_payments(payment_date);

-- 12. SUPPLIER PAYMENTS TABLE
CREATE TABLE supplier_payments (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    purchase_id INTEGER REFERENCES purchases(id),
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    reference_number VARCHAR(100),
    created_by VARCHAR(100) NOT NULL,
    notes TEXT,
    payment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supplier_payments_supplier ON supplier_payments(supplier_id);
CREATE INDEX idx_supplier_payments_date ON supplier_payments(payment_date);

-- 13. DAY CLOSING TABLE (Daily Reconciliation)
CREATE TABLE day_closings (
    id SERIAL PRIMARY KEY,
    closing_date DATE NOT NULL UNIQUE,
    total_sales DECIMAL(12,2),
    total_bills INTEGER,
    cash_collected DECIMAL(12,2),
    card_collected DECIMAL(12,2),
    online_collected DECIMAL(12,2),
    opening_balance DECIMAL(12,2),
    closing_balance DECIMAL(12,2),
    closing_notes TEXT,
    closed_by VARCHAR(100) NOT NULL,
    closed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_day_closings_date ON day_closings(closing_date);

-- 14. ACTIVITY LOG (Audit Trail)
CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- 'PRODUCT', 'CUSTOMER', 'SALE', etc.
    entity_id INTEGER,
    old_values TEXT, -- JSON
    new_values TEXT, -- JSON
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_log_user ON activity_log(user_email);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_date ON activity_log(created_at);

-- 15. REPORTS TABLE (Cached Reports)
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    report_name VARCHAR(100) NOT NULL,
    report_type VARCHAR(50), -- 'DAILY_SALES', 'INVENTORY_VALUATION', 'PROFIT_LOSS', etc.
    report_date DATE NOT NULL,
    data JSONB, -- Store complete report data as JSON
    generated_by VARCHAR(100) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_date ON reports(report_date);

-- ====================================================================
-- VIEWS FOR QUICK QUERIES
-- ====================================================================

-- Sales Summary View
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT 
    DATE(bill_date) as sale_date,
    COUNT(*) as total_bills,
    SUM(total_amount) as total_sales,
    COUNT(DISTINCT customer_id) as unique_customers,
    AVG(total_amount) as avg_bill_value,
    SUM(gst_amount) as total_gst
FROM sales
WHERE status = 'COMPLETED'
GROUP BY DATE(bill_date)
ORDER BY sale_date DESC;

-- Customer Outstanding View
CREATE OR REPLACE VIEW customer_outstanding_summary AS
SELECT 
    c.id,
    c.name,
    c.phone,
    c.email,
    COUNT(DISTINCT s.id) as total_purchases,
    COALESCE(SUM(CASE WHEN s.status = 'COMPLETED' THEN s.total_amount ELSE 0 END), 0) as total_purchased,
    COALESCE(SUM(cp.amount), 0) as total_paid,
    COALESCE(SUM(CASE WHEN s.status = 'COMPLETED' THEN s.total_amount ELSE 0 END), 0) - 
    COALESCE(SUM(cp.amount), 0) as outstanding_amount
FROM customers c
LEFT JOIN sales s ON c.id = s.customer_id
LEFT JOIN customer_payments cp ON c.id = cp.customer_id
GROUP BY c.id, c.name, c.phone, c.email;

-- Inventory Valuation View
CREATE OR REPLACE VIEW inventory_valuation AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.cost_price,
    p.mrp,
    i.current_stock,
    (i.current_stock * p.cost_price) as cost_valuation,
    (i.current_stock * p.mrp) as retail_valuation,
    CASE 
        WHEN i.current_stock <= reorder_level THEN 'LOW'
        WHEN i.current_stock > (reorder_level * 5) THEN 'HIGH'
        ELSE 'NORMAL'
    END as stock_status
FROM products p
JOIN inventory i ON p.id = i.product_id
WHERE p.is_active = true;

-- ====================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ====================================================================

-- Trigger: Update product updated_at
CREATE OR REPLACE FUNCTION update_product_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_product_timestamp();

-- Trigger: Update customer outstanding dues after payment
CREATE OR REPLACE FUNCTION update_customer_outstanding()
RETURNS TRIGGER AS $$
DECLARE
    v_total_purchased DECIMAL(12,2);
    v_total_paid DECIMAL(12,2);
BEGIN
    SELECT COALESCE(SUM(CASE WHEN s.status = 'COMPLETED' THEN s.total_amount ELSE 0 END), 0)
    INTO v_total_purchased
    FROM sales s
    WHERE s.customer_id = NEW.customer_id;
    
    SELECT COALESCE(SUM(amount), 0)
    INTO v_total_paid
    FROM customer_payments
    WHERE customer_id = NEW.customer_id;
    
    UPDATE customers
    SET outstanding_dues = v_total_purchased - v_total_paid,
        total_spent = v_total_purchased
    WHERE id = NEW.customer_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_outstanding_after_payment
AFTER INSERT ON customer_payments
FOR EACH ROW
EXECUTE FUNCTION update_customer_outstanding();

-- Trigger: Update inventory after stock movement
CREATE OR REPLACE FUNCTION update_inventory_from_movement()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.movement_type = 'IN' THEN
        UPDATE inventory SET current_stock = current_stock + NEW.quantity WHERE product_id = NEW.product_id;
    ELSIF NEW.movement_type = 'OUT' THEN
        UPDATE inventory SET current_stock = current_stock - NEW.quantity WHERE product_id = NEW.product_id;
    ELSIF NEW.movement_type = 'ADJUSTMENT' THEN
        UPDATE inventory SET current_stock = NEW.quantity WHERE product_id = NEW.product_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_on_movement
AFTER INSERT ON stock_movements
FOR EACH ROW
EXECUTE FUNCTION update_inventory_from_movement();

-- Trigger: Create stock movements when sale is created
CREATE OR REPLACE FUNCTION create_stock_movement_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, reference_id, created_by)
    SELECT product_id, 'OUT', quantity, 'SALE', NEW.id, NEW.created_by
    FROM sale_items
    WHERE sale_id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stock_movement_on_sale_insert
AFTER INSERT ON sales
FOR EACH ROW
EXECUTE FUNCTION create_stock_movement_on_sale();

-- ====================================================================
-- SAMPLE DATA (OPTIONAL - Comment out for production)
-- ====================================================================

INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic items and gadgets'),
('Grocery', 'Food and grocery items'),
('Beauty', 'Beauty and personal care'),
('Clothing', 'Apparel and fashion'),
('Books', 'Books and educational materials');

INSERT INTO products (name, sku, category_id, cost_price, mrp, selling_price) VALUES
('Product A', 'SKU-001', 1, 500, 899, 799),
('Product B', 'SKU-002', 2, 150, 299, 249),
('Product C', 'SKU-003', 3, 250, 599, 499);

INSERT INTO inventory (product_id, current_stock, reorder_level) VALUES
(1, 45, 10),
(2, 120, 20),
(3, 5, 15);

INSERT INTO customers (name, phone, email, city, state) VALUES
('John Doe', '9876543210', 'john@email.com', 'Bangalore', 'Karnataka'),
('Jane Smith', '9876543211', 'jane@email.com', 'Bangalore', 'Karnataka'),
('Bob Wilson', '9876543212', 'bob@email.com', 'Hyderabad', 'Telangana');

INSERT INTO suppliers (name, contact_person, phone, email, city, state) VALUES
('Supplier A', 'Contact A', '9876543220', 'supplier@email.com', 'Delhi', 'Delhi'),
('Supplier B', 'Contact B', '9876543221', 'supplierb@email.com', 'Mumbai', 'Maharashtra'),
('Supplier C', 'Contact C', '9876543222', 'supplierc@email.com', 'Chennai', 'Tamil Nadu');

-- ====================================================================
-- USEFUL QUERIES
-- ====================================================================

-- Get daily sales summary
-- SELECT * FROM daily_sales_summary;

-- Get all products with low stock
-- SELECT * FROM inventory_valuation WHERE stock_status = 'LOW';

-- Get customer payment status
-- SELECT * FROM customer_outstanding_summary WHERE outstanding_amount > 0;

-- Get total inventory value
-- SELECT SUM(cost_valuation) as total_cost, SUM(retail_valuation) as total_retail FROM inventory_valuation;

-- Get sales by payment method for today
-- SELECT payment_method, COUNT(*) as count, SUM(total_amount) as total FROM sales WHERE bill_date = CURRENT_DATE GROUP BY payment_method;

-- ====================================================================
-- CONSTRAINTS AND INDEXES SUMMARY
-- ====================================================================
/*
CREATED TABLES: 15
CREATED INDEXES: 30+
TRIGGERS: 4
VIEWS: 3

KEY FEATURES:
✅ Complete inventory management
✅ Sales & billing system
✅ Customer tracking with credit limits
✅ Supplier management with payables
✅ Stock movement audit trail
✅ Payment tracking for customers & suppliers
✅ Daily closing/reconciliation
✅ Activity logging for audit
✅ Automatic updates via triggers
✅ Fast queries via indexes and views
✅ Full audit trail via stock_movements & activity_log
✅ GST calculation support
✅ Return & refund support
✅ Credit management for customers
✅ Multiple payment methods support
*/

-- ====================================================================
-- END OF SCHEMA
-- ====================================================================
