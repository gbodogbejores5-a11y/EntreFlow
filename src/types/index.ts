export interface Company {
  id: string
  company_name: string
  logo_url: string | null
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  created_at: string
}

export interface User {
  id: string
  company_id: string
  full_name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  created_at: string
}

export interface Client {
  id: string
  company_id: string
  full_name: string
  phone: string | null
  email: string | null
  city: string | null
  address: string | null
  created_at: string
}

export interface Product {
  id: string
  company_id: string
  name: string
  description: string | null
  category: string | null
  quantity: number
  unit_price: number
  low_stock_threshold: number
  created_at: string
}

export interface Quote {
  id: string
  company_id: string
  client_id: string | null
  quote_number: string
  status: 'draft' | 'sent' | 'paid'
  subtotal: number
  total: number
  created_at: string
  clients?: Client | null
  quote_items?: QuoteItem[]
}

export interface QuoteItem {
  id: string
  quote_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface StockAlert {
  id: string
  company_id: string
  product_id: string
  alert_type: 'low_stock'
  created_at: string
  products?: Product
}
