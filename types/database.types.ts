/**
 * ==============================================================================
 * DATABASE TYPES FOR SUPABASE (FINANZAS PERSONALES)
 * Moneda: USD ($)
 * Filosofía: "Págate a ti primero"
 * ==============================================================================
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Tipos de dominio específicos
export type TermType = 'short' | 'medium' | 'long';
export type CategoryType = 'income' | 'fixed_expense' | 'variable_expense';
export type RecurringType = 'income' | 'fixed_expense';
export type BudgetAlertStatus = 'normal' | 'warning' | 'critical';

export interface Database {
  public: {
    Tables: {
      savings_goals: {
        Row: {
          id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          monthly_quota: number;
          term_type: TermType;
          deadline: string | null;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          monthly_quota?: number;
          term_type: TermType;
          deadline?: string | null;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          target_amount?: number;
          current_amount?: number;
          monthly_quota?: number;
          term_type?: TermType;
          deadline?: string | null;
          color?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          type: CategoryType;
          monthly_budget_limit: number;
          color: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: CategoryType;
          monthly_budget_limit?: number;
          color?: string;
          icon?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: CategoryType;
          monthly_budget_limit?: number;
          color?: string;
          icon?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      recurring_templates: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          amount: number;
          type: RecurringType;
          day_of_month: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          amount: number;
          type: RecurringType;
          day_of_month: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          amount?: number;
          type?: RecurringType;
          day_of_month?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'recurring_templates_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          }
        ];
      };
      transactions: {
        Row: {
          id: string;
          category_id: string | null;
          goal_id: string | null;
          description: string;
          amount: number;
          date: string;
          is_extra: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          goal_id?: string | null;
          description: string;
          amount: number;
          date?: string;
          is_extra?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          goal_id?: string | null;
          description?: string;
          amount?: number;
          date?: string;
          is_extra?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transactions_goal_id_fkey';
            columns: ['goal_id'];
            isOneToOne: false;
            referencedRelation: 'savings_goals';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      term_type: TermType;
      category_type: CategoryType;
      recurring_type: RecurringType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// ==============================================================================
// TIPOS DE ENTIDAD CONVENIENTES PARA EL FRONTEND
// ==============================================================================
export type SavingsGoal = Database['public']['Tables']['savings_goals']['Row'];
export type SavingsGoalInsert = Database['public']['Tables']['savings_goals']['Insert'];
export type SavingsGoalUpdate = Database['public']['Tables']['savings_goals']['Update'];

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export type RecurringTemplate = Database['public']['Tables']['recurring_templates']['Row'];
export type RecurringTemplateInsert = Database['public']['Tables']['recurring_templates']['Insert'];
export type RecurringTemplateUpdate = Database['public']['Tables']['recurring_templates']['Update'];

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

// ==============================================================================
// MODELOS AUXILIARES: FLUJO EN CASCADA Y ESTADO DE PRESUPUESTO
// ==============================================================================

/**
 * Transacción enriquecida con los datos de su categoría o meta asociada.
 */
export interface EnrichedTransaction extends Transaction {
  category?: Category | null;
  goal?: SavingsGoal | null;
}

/**
 * Plantilla recurrente enriquecida con su categoría.
 */
export interface EnrichedRecurringTemplate extends RecurringTemplate {
  category?: Category | null;
}

/**
 * Resumen del cálculo mensual según la filosofía "Págate a ti primero":
 * [Ingresos Fijos + Extras] - [Cuotas Obligatorias de Metas] - [Gastos Fijos] = [Disponible para Variables]
 */
export interface FinancialFlowSummary {
  fixedIncome: number;                // Suma de plantillas activas de ingresos
  extraIncome: number;                // Suma de transacciones con is_extra = true
  totalIncome: number;                // fixedIncome + extraIncome
  savingsQuotas: number;              // Suma de cuotas mensuales de todas las metas activas
  fixedExpenses: number;              // Suma de plantillas activas de gastos fijos
  availableForVariables: number;      // totalIncome - savingsQuotas - fixedExpenses (Base disponible)
  variableExpensesSpent: number;      // Gastos variables reales ejecutados en el mes
  netSavingsBalance: number;          // availableForVariables - variableExpensesSpent (Sobrante real del mes)
}

/**
 * Estado y métricas de una categoría de gasto variable frente a su presupuesto asignado.
 */
export interface CategoryBudgetAnalysis {
  category: Category;
  spent: number;                      // Total gastado en el periodo actual
  budgetLimit: number;                // monthly_budget_limit asignado
  remaining: number;                  // budgetLimit - spent
  percentageUsed: number;             // (spent / budgetLimit) * 100
  status: BudgetAlertStatus;          // 'normal' (<80%) | 'warning' (>=80%) | 'critical' (>100%)
}

/**
 * Progreso consolidado de una meta de ahorro.
 */
export interface SavingsGoalProgress {
  goal: SavingsGoal;
  percentageCompleted: number;        // (current_amount / target_amount) * 100
  remainingAmount: number;            // target_amount - current_amount
  monthsToGoal: number | null;        // Meses proyectados al ritmo de monthly_quota
}
