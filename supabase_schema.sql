-- 1. Table for Categories (Customizable icons and colors)
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'tag',
    color TEXT DEFAULT '#64748b',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for Transactions (Combined Expenses & Income)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    amount DECIMAL(12, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    note TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table for Budgets (Monthly limits)
CREATE TABLE IF NOT EXISTS budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    amount_limit DECIMAL(12, 2) NOT NULL,
    month_year DATE NOT NULL, -- Format: YYYY-MM-01
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Initial Seed Data: Categories
INSERT INTO categories (name, icon, color) VALUES 
('Food & Drinks', 'utensils', '#f97316'),
('Transportation', 'car', '#3b82f6'),
('Shopping', 'shopping-bag', '#ec4899'),
('Entertainment', 'film', '#a855f7'),
('Health', 'heart', '#ef4444'),
('Bills & Utilities', 'credit-card', '#06b6d4'),
('Education', 'graduation-cap', '#6366f1'),
('Salary', 'banknotes', '#22c55e'),
('Other', 'tag', '#64748b')
ON CONFLICT (name) DO NOTHING;

-- 5. Table for Savings Goals
CREATE TABLE IF NOT EXISTS savings_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0,
    target_date DATE,
    icon TEXT DEFAULT 'target',
    color TEXT DEFAULT '#4f46e5',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
