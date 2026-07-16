-- EntreFlow Database Schema

-- Companies table
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  city TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes table
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  quote_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote items table
CREATE TABLE quote_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0
);

-- Stock alerts table
CREATE TABLE stock_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL DEFAULT 'low_stock' CHECK (alert_type IN ('low_stock')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_clients_company_id ON clients(company_id);
CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_quotes_company_id ON quotes(company_id);
CREATE INDEX idx_quotes_client_id ON quotes(client_id);
CREATE INDEX idx_quote_items_quote_id ON quote_items(quote_id);
CREATE INDEX idx_stock_alerts_company_id ON stock_alerts(company_id);

-- Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own company" ON companies
  FOR ALL USING (id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can view their own company users" ON users
  FOR ALL USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage their company clients" ON clients
  FOR ALL USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage their company products" ON products
  FOR ALL USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage their company quotes" ON quotes
  FOR ALL USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage their company quote items" ON quote_items
  FOR ALL USING (quote_id IN (
    SELECT id FROM quotes WHERE company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage their company stock alerts" ON stock_alerts
  FOR ALL USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- Quote number sequence
CREATE SEQUENCE IF NOT EXISTS quote_number_seq START 1000;
