-- ==============================================================================
-- SCHEMA DDL: SISTEMA DE FINANZAS PERSONALES Y AHORRO
-- Moneda: USD
-- Filosofía: "Págate a ti primero"
-- ==============================================================================

-- 1. Habilitar extensión pgcrypto para UUIDs si no está activa
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA: savings_goals (Metas de Ahorro)
CREATE TABLE IF NOT EXISTS savings_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (current_amount >= 0),
    monthly_quota NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (monthly_quota >= 0),
    term_type TEXT NOT NULL CHECK (term_type IN ('short', 'medium', 'long')),
    deadline DATE,
    color TEXT NOT NULL DEFAULT '#10b981',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABLA: categories (Categorías de Ingresos y Gastos)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'fixed_expense', 'variable_expense')),
    monthly_budget_limit NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (monthly_budget_limit >= 0),
    color TEXT NOT NULL DEFAULT '#64748b',
    icon TEXT NOT NULL DEFAULT 'Tag',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABLA: recurring_templates (Plantillas de Ingresos y Gastos Fijos Recurrentes)
CREATE TABLE IF NOT EXISTS recurring_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('income', 'fixed_expense')),
    day_of_month INTEGER NOT NULL CHECK (day_of_month >= 1 AND day_of_month <= 31),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABLA: transactions (Movimientos Diarios, Gastos Variables e Ingresos Extras)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    goal_id UUID REFERENCES savings_goals(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_extra BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ÍNDICES DE RENDIMIENTO PARA FILTROS POR FECHA Y CATEGORÍA
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_goal_id ON transactions(goal_id);
CREATE INDEX IF NOT EXISTS idx_recurring_templates_category_id ON recurring_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_savings_goals_term_type ON savings_goals(term_type);

-- ==============================================================================
-- DATOS INICIALES SEMILLA (CATEGORÍAS BASE)
-- ==============================================================================
INSERT INTO categories (name, type, monthly_budget_limit, color, icon)
VALUES 
  -- Ingresos
  ('Sueldo Principal', 'income', 0.00, '#10b981', 'Wallet'),
  ('Trabajos Extra / Freelance', 'income', 0.00, '#06b6d4', 'Briefcase'),
  ('Rendimientos e Inversiones', 'income', 0.00, '#8b5cf6', 'TrendingUp'),
  
  -- Gastos Fijos Recurrentes
  ('Vivienda (Alquiler/Hipoteca)', 'fixed_expense', 0.00, '#6366f1', 'Home'),
  ('Servicios Básicos (Luz, Agua, Internet)', 'fixed_expense', 0.00, '#3b82f6', 'Zap'),
  ('Suscripciones y Seguros', 'fixed_expense', 0.00, '#ec4899', 'CreditCard'),
  
  -- Gastos Variables (con límites mensuales sugeridos en USD)
  ('Alimentación y Supermercado', 'variable_expense', 350.00, '#f59e0b', 'ShoppingCart'),
  ('Transporte y Gasolina', 'variable_expense', 120.00, '#0ea5e9', 'Car'),
  ('Ocio, Salidas y Restaurantes', 'variable_expense', 150.00, '#f43f5e', 'Utensils'),
  ('Salud y Farmacia', 'variable_expense', 80.00, '#14b8a6', 'HeartPulse'),
  ('Compras Personales y Ropa', 'variable_expense', 100.00, '#a855f7', 'ShoppingBag')
ON CONFLICT DO NOTHING;
