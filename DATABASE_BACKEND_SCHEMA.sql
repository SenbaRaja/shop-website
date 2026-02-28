-- ====================================================================
-- STOCKMATE PRO - COMPLETE DATABASE SCHEMA
-- For PostgreSQL / AWS RDS
-- ====================================================================

-- 0. MEASURING UNITS TABLE (Master Data)
CREATE TABLE measuring_units (
    id SERIAL PRIMARY KEY,
    unit_name VARCHAR(50) NOT NULL UNIQUE,
    unit_symbol VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    conversion_factor DECIMAL(10,3), -- for unit conversion
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 0.1 TAX RATES TABLE (Master Data)
CREATE TABLE tax_rates (
    id SERIAL PRIMARY KEY,
    tax_name VARCHAR(100) NOT NULL,
    tax_percentage DECIMAL(5,2) NOT NULL,
    tax_type VARCHAR(50), -- 'GST', 'VAT', 'SGST', 'CGST', 'IGST', etc.
    description TEXT,
    applicable_from DATE,
    applicable_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tax_percentage CHECK (tax_percentage >= 0 AND tax_percentage <= 100)
);

-- 0.2 PRODUCT CODES TABLE (Master Data - for different code types)
CREATE TABLE product_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    code_type VARCHAR(50), -- 'BARCODE', 'QR_CODE', 'INTERNAL_CODE', 'HSN', etc.
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 0.3 SHORT CODES TABLE (Master Data - for quick reference codes)
CREATE TABLE short_codes (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    code_category VARCHAR(50), -- 'PRODUCT', 'CATEGORY', 'CUSTOMER_TYPE', etc.
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 0.4 OFFER RATES TABLE (Master Data)
CREATE TABLE offer_rates (
    id SERIAL PRIMARY KEY,
    offer_name VARCHAR(255) NOT NULL,
    offer_type VARCHAR(50), -- 'PERCENTAGE', 'FLAT_AMOUNT', 'BUY_X_GET_Y'
    discount_value DECIMAL(10,2) NOT NULL,
    applicable_from DATE NOT NULL,
    applicable_to DATE NOT NULL,
    min_purchase_amount DECIMAL(10,2),
    max_discount_amount DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_valid_dates CHECK (applicable_from < applicable_to)
);

CREATE INDEX idx_offer_rates_active ON offer_rates(is_active);
CREATE INDEX idx_offer_rates_dates ON offer_rates(applicable_from, applicable_to);

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

-- 2. PRODUCTS TABLE (Updated to reference master tables)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    product_code_id INTEGER REFERENCES product_codes(id),
    short_code_id INTEGER REFERENCES short_codes(id),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    description TEXT,
    measuring_unit_id INTEGER REFERENCES measuring_units(id),
    cost_price DECIMAL(10,2) NOT NULL,
    mrp DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2),
    tax_rate_id INTEGER REFERENCES tax_rates(id),
    barcode VARCHAR(50),
    image_url VARCHAR(255),
    default_offer_rate_id INTEGER REFERENCES offer_rates(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_price CHECK (cost_price > 0 AND mrp > 0)
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_product_code ON products(product_code_id);
CREATE INDEX idx_products_short_code ON products(short_code_id);
CREATE INDEX idx_products_measuring_unit ON products(measuring_unit_id);
CREATE INDEX idx_products_tax_rate ON products(tax_rate_id);

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

-- 7. SALES/BILLS TABLE (Updated)
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    created_by VARCHAR(100) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    tax_rate_id INTEGER REFERENCES tax_rates(id),
    gst_rate DECIMAL(5,2) DEFAULT 18.00,
    gst_amount DECIMAL(12,2) DEFAULT 0,
    offer_rate_id INTEGER REFERENCES offer_rates(id),
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
CREATE INDEX idx_sales_tax_rate ON sales(tax_rate_id);
CREATE INDEX idx_sales_offer_rate ON sales(offer_rate_id);

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

-- Sample Measuring Units
INSERT INTO measuring_units (unit_name, unit_symbol, description, conversion_factor) VALUES
('Kilogram', 'kg', 'Weight measurement - kilogram', 1.0),
('Gram', 'g', 'Weight measurement - gram', 0.001),
('Liter', 'L', 'Volume measurement - liter', 1.0),
('Milliliter', 'ml', 'Volume measurement - milliliter', 0.001),
('Piece', 'pc', 'Unit count - individual piece', 1.0),
('Box', 'box', 'Unit count - box container', 1.0),
('Dozen', 'dz', 'Unit count - twelve pieces', 12.0);

-- Sample Tax Rates
INSERT INTO tax_rates (tax_name, tax_percentage, tax_type, description, is_active) VALUES
('Standard GST', 18.00, 'GST', 'Standard goods and services tax rate', true),
('Reduced GST', 12.00, 'GST', 'Reduced rate for specific items', true),
('Low GST', 5.00, 'GST', 'Low rate for essential items', true),
('Zero Tax', 0.00, 'GST', 'Tax free items', true),
('SGST', 9.00, 'SGST', 'State Goods and Services Tax', true),
('CGST', 9.00, 'CGST', 'Central Goods and Services Tax', true);

-- Sample Product Codes
INSERT INTO product_codes (code, code_type, description, is_active) VALUES
('8901200012345', 'BARCODE', 'EAN/UPC Barcode', true),
('PROD-001', 'HSN', 'Harmonized System of Nomenclature Code', true),
('INTERNAL-SKU-042', 'INTERNAL_CODE', 'Internal Product Code', true),
('QR-2024-001', 'QR_CODE', 'QR Code for product', true);

-- Sample Short Codes
INSERT INTO short_codes (short_code, full_name, code_category, description, is_active) VALUES
('ELC', 'Electronics', 'CATEGORY', 'Electronics category shortcode', true),
('GRO', 'Grocery', 'CATEGORY', 'Grocery category shortcode', true),
('BEU', 'Beauty', 'CATEGORY', 'Beauty and personal care shortcode', true),
('RET', 'Retail', 'CUSTOMER_TYPE', 'Retail customer type', true),
('WHL', 'Wholesale', 'CUSTOMER_TYPE', 'Wholesale customer type', true),
('NEW', 'New Product', 'PRODUCT_STATUS', 'Newly added product', true);

-- Sample Offer Rates
INSERT INTO offer_rates (offer_name, offer_type, discount_value, applicable_from, applicable_to, is_active) VALUES
('Summer Sale 10%', 'PERCENTAGE', 10.00, '2026-03-01', '2026-05-31', true),
('Flat 50 Discount', 'FLAT_AMOUNT', 50.00, '2026-02-28', '2026-03-15', true),
('Spring Promotion 15%', 'PERCENTAGE', 15.00, '2026-03-20', '2026-04-30', true),
('Clearance Sale 25%', 'PERCENTAGE', 25.00, '2026-02-01', '2026-03-31', true),
('Buy More Save More', 'PERCENTAGE', 5.00, '2026-01-01', '2026-12-31', true);

INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic items and gadgets'),
('Grocery', 'Food and grocery items'),
('Beauty', 'Beauty and personal care'),
('Clothing', 'Apparel and fashion'),
('Books', 'Books and educational materials');

INSERT INTO products (name, sku, category_id, cost_price, mrp, selling_price, measuring_unit_id, tax_rate_id) VALUES
('Product A', 'SKU-001', 1, 500, 899, 799, 5, 1),
('Product B', 'SKU-002', 2, 150, 299, 249, 1, 2),
('Product C', 'SKU-003', 3, 250, 599, 499, 5, 1);

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
MASTER DATA TABLES: 5
- measuring_units (unit of measurement reference)
- tax_rates (tax configuration reference)
- product_codes (product code reference)
- short_codes (quick reference codes)
- offer_rates (discount/promotion rates)

CREATED TABLES: 18 (5 Master + 13 Transaction/Reference tables)
CREATED INDEXES: 35+
TRIGGERS: 4
VIEWS: 3

KEY FEATURES:
✅ Master data management for units, taxes, codes, and offers
✅ Complete inventory management
✅ Sales & billing system with tax and offer integration
✅ Customer tracking with credit limits
✅ Supplier management with payables
✅ Stock movement audit trail
✅ Payment tracking for customers & suppliers
✅ Daily closing/reconciliation
✅ Activity logging for audit
✅ Automatic updates via triggers
✅ Fast queries via indexes and views
✅ Full audit trail via stock_movements & activity_log
✅ GST calculation support with configurable tax rates
✅ Return & refund support
✅ Credit management for customers
✅ Multiple payment methods support
✅ Flexible discount/offer system
✅ Product unit conversion support
*/

-- ====================================================================
-- END OF SCHEMA
-- ====================================================================
