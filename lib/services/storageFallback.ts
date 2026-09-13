import type {
  Category,
  SavingsGoal,
  RecurringTemplate,
  Transaction,
} from '@/types/database.types';

const STORAGE_KEYS = {
  CATEGORIES: 'fp_categories_v1',
  GOALS: 'fp_goals_v1',
  RECURRING: 'fp_recurring_v1',
  TRANSACTIONS: 'fp_transactions_v1',
  INITIALIZED: 'fp_initialized_v1',
};

// 11 Categorías estándar iniciales
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-inc-1', name: 'Sueldo Principal', type: 'income', monthly_budget_limit: 0, color: '#10b981', icon: 'Wallet', created_at: new Date().toISOString() },
  { id: 'cat-inc-2', name: 'Trabajos Extra / Freelance', type: 'income', monthly_budget_limit: 0, color: '#06b6d4', icon: 'Briefcase', created_at: new Date().toISOString() },
  { id: 'cat-inc-3', name: 'Rendimientos e Inversiones', type: 'income', monthly_budget_limit: 0, color: '#8b5cf6', icon: 'TrendingUp', created_at: new Date().toISOString() },

  { id: 'cat-fix-1', name: 'Vivienda (Alquiler/Hipoteca)', type: 'fixed_expense', monthly_budget_limit: 0, color: '#6366f1', icon: 'Home', created_at: new Date().toISOString() },
  { id: 'cat-fix-2', name: 'Servicios Básicos (Luz, Agua, Internet)', type: 'fixed_expense', monthly_budget_limit: 0, color: '#3b82f6', icon: 'Zap', created_at: new Date().toISOString() },
  { id: 'cat-fix-3', name: 'Suscripciones y Seguros', type: 'fixed_expense', monthly_budget_limit: 0, color: '#ec4899', icon: 'CreditCard', created_at: new Date().toISOString() },

  { id: 'cat-var-1', name: 'Alimentación y Supermercado', type: 'variable_expense', monthly_budget_limit: 150, color: '#f59e0b', icon: 'ShoppingCart', created_at: new Date().toISOString() },
  { id: 'cat-var-2', name: 'Transporte y Gasolina', type: 'variable_expense', monthly_budget_limit: 60, color: '#0ea5e9', icon: 'Car', created_at: new Date().toISOString() },
  { id: 'cat-var-3', name: 'Ocio, Salidas y Restaurantes', type: 'variable_expense', monthly_budget_limit: 50, color: '#f43f5e', icon: 'Utensils', created_at: new Date().toISOString() },
  { id: 'cat-var-4', name: 'Salud y Farmacia', type: 'variable_expense', monthly_budget_limit: 40, color: '#14b8a6', icon: 'HeartPulse', created_at: new Date().toISOString() },
  { id: 'cat-var-5', name: 'Compras Personales y Ropa', type: 'variable_expense', monthly_budget_limit: 50, color: '#a855f7', icon: 'ShoppingBag', created_at: new Date().toISOString() },
];

// Metas de ahorro iniciales (Cuota obligatoria: $100 USD)
export const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'Fondo de Emergencia (6 meses)',
    target_amount: 2400,
    current_amount: 700,
    monthly_quota: 100, // Cuota obligatoria retenida "Págate a ti primero"
    term_type: 'short',
    deadline: '2026-12-31',
    color: '#10b981',
    created_at: new Date().toISOString(),
  },
  {
    id: 'goal-2',
    name: 'Fondo para Diplomado / Cursos',
    target_amount: 800,
    current_amount: 250,
    monthly_quota: 0,
    term_type: 'medium',
    deadline: '2027-06-30',
    color: '#8b5cf6',
    created_at: new Date().toISOString(),
  }
];

// Plantillas de ingresos y gastos fijos recurrentes:
// Ingreso Fijo = $850 USD
// Gastos Fijos = $300 USD ($220 vivienda + $60 servicios + $20 suscripciones)
export const INITIAL_RECURRING: RecurringTemplate[] = [
  {
    id: 'rec-inc-1',
    category_id: 'cat-inc-1',
    name: 'Sueldo Mensual Principal',
    amount: 850,
    type: 'income',
    day_of_month: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'rec-fix-1',
    category_id: 'cat-fix-1',
    name: 'Alquiler Vivienda',
    amount: 220,
    type: 'fixed_expense',
    day_of_month: 5,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'rec-fix-2',
    category_id: 'cat-fix-2',
    name: 'Internet Fibra y Electricidad',
    amount: 60,
    type: 'fixed_expense',
    day_of_month: 10,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'rec-fix-3',
    category_id: 'cat-fix-3',
    name: 'Seguro Médico Básico',
    amount: 20,
    type: 'fixed_expense',
    day_of_month: 15,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Transacciones del mes:
// Ingreso Extra = $50 USD -> Ingresos Totales = $850 + $50 = $900 USD
// Gastos Variables = $200 USD ($110 súper + $45 transporte + $35 ocio + $10 salud)
// Gastos Totales = $100 (Ahorro) + $300 (Fijos) + $200 (Variables) = $600 USD
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-inc-extra-1',
    category_id: 'cat-inc-2',
    goal_id: null,
    description: 'Trabajo Freelance de Diseño',
    amount: 50,
    date: new Date().toISOString().split('T')[0],
    is_extra: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'tx-var-1',
    category_id: 'cat-var-1',
    goal_id: null,
    description: 'Supermercado Mensual y Frutas',
    amount: 110,
    date: new Date().toISOString().split('T')[0],
    is_extra: false,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'tx-var-2',
    category_id: 'cat-var-2',
    goal_id: null,
    description: 'Gasolina y Transporte Semanal',
    amount: 45,
    date: new Date().toISOString().split('T')[0],
    is_extra: false,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'tx-var-3',
    category_id: 'cat-var-3',
    goal_id: null,
    description: 'Salida a Cenar Fin de Semana',
    amount: 35,
    date: new Date().toISOString().split('T')[0],
    is_extra: false,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'tx-var-4',
    category_id: 'cat-var-4',
    goal_id: null,
    description: 'Farmacia / Vitaminas',
    amount: 10,
    date: new Date().toISOString().split('T')[0],
    is_extra: false,
    created_at: new Date().toISOString(),
  },
];

// Helper seguro para localStorage
class LocalStorageManager {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public get<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  public set<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignorar fallos de cuota o modo incógnito restringido
    }
  }

  public initSeedData(): void {
    if (!this.isBrowser()) return;
    const initialized = this.get<boolean>(STORAGE_KEYS.INITIALIZED, false);
    if (!initialized) {
      this.resetToDefaults();
    }
  }

  public resetToDefaults(): void {
    if (!this.isBrowser()) return;
    this.set(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    this.set(STORAGE_KEYS.GOALS, INITIAL_GOALS);
    this.set(STORAGE_KEYS.RECURRING, INITIAL_RECURRING);
    this.set(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    this.set(STORAGE_KEYS.INITIALIZED, true);
  }

  public getCategories(): Category[] {
    return this.get<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  public saveCategories(items: Category[]): void {
    this.set(STORAGE_KEYS.CATEGORIES, items);
  }

  public getGoals(): SavingsGoal[] {
    return this.get<SavingsGoal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS);
  }

  public saveGoals(items: SavingsGoal[]): void {
    this.set(STORAGE_KEYS.GOALS, items);
  }

  public getRecurring(): RecurringTemplate[] {
    return this.get<RecurringTemplate[]>(STORAGE_KEYS.RECURRING, INITIAL_RECURRING);
  }

  public saveRecurring(items: RecurringTemplate[]): void {
    this.set(STORAGE_KEYS.RECURRING, items);
  }

  public getTransactions(): Transaction[] {
    return this.get<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }

  public saveTransactions(items: Transaction[]): void {
    this.set(STORAGE_KEYS.TRANSACTIONS, items);
  }
}

export const storageFallback = new LocalStorageManager();
