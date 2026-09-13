import type {
  SavingsGoal,
  SavingsGoalInsert,
  SavingsGoalUpdate,
  Category,
  RecurringTemplate,
  RecurringTemplateInsert,
  RecurringTemplateUpdate,
  Transaction,
  TransactionInsert,
  EnrichedTransaction,
  FinancialFlowSummary,
  CategoryBudgetAnalysis,
  SavingsGoalProgress,
} from './database.types';

// ==============================================================================
// CONTRATOS DE SERVICIOS (STREAM A: SUBAGENTE 1 [PERSIST])
// ==============================================================================

export interface ICategoriesService {
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  updateCategoryLimit(id: string, newLimit: number): Promise<Category>;
}

export interface IGoalsService {
  getGoals(): Promise<SavingsGoal[]>;
  getGoalById(id: string): Promise<SavingsGoal | null>;
  createGoal(goal: SavingsGoalInsert): Promise<SavingsGoal>;
  updateGoal(id: string, updates: SavingsGoalUpdate): Promise<SavingsGoal>;
  deleteGoal(id: string): Promise<void>;
  contributeToGoal(id: string, amount: number): Promise<SavingsGoal>;
}

export interface IRecurringService {
  getTemplates(): Promise<RecurringTemplate[]>;
  createTemplate(template: RecurringTemplateInsert): Promise<RecurringTemplate>;
  updateTemplate(id: string, updates: RecurringTemplateUpdate): Promise<RecurringTemplate>;
  deleteTemplate(id: string): Promise<void>;
  toggleActive(id: string, isActive: boolean): Promise<RecurringTemplate>;
}

export interface ITransactionsService {
  getTransactions(month?: number, year?: number): Promise<EnrichedTransaction[]>;
  createTransaction(tx: TransactionInsert): Promise<EnrichedTransaction>;
  deleteTransaction(id: string): Promise<void>;
}

// ==============================================================================
// CONTRATOS DE ESTADO FINANCIERO (STREAM B: SUBAGENTE 2 [ENGINE])
// ==============================================================================

export interface FinanceContextType {
  goals: SavingsGoal[];
  recurringTemplates: RecurringTemplate[];
  transactions: EnrichedTransaction[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Acciones de mutación reactivas
  addGoal: (goal: SavingsGoalInsert) => Promise<SavingsGoal>;
  editGoal: (id: string, updates: SavingsGoalUpdate) => Promise<SavingsGoal>;
  removeGoal: (id: string) => Promise<void>;
  depositToGoal: (id: string, amount: number) => Promise<SavingsGoal>;

  addRecurring: (template: RecurringTemplateInsert) => Promise<RecurringTemplate>;
  editRecurring: (id: string, updates: RecurringTemplateUpdate) => Promise<RecurringTemplate>;
  removeRecurring: (id: string) => Promise<void>;
  toggleRecurring: (id: string, isActive: boolean) => Promise<RecurringTemplate>;

  addTransaction: (tx: TransactionInsert) => Promise<EnrichedTransaction>;
  removeTransaction: (id: string) => Promise<void>;
  refreshAll: () => Promise<void>;
  resetToDemoData: () => Promise<void>;
}

export interface FinancialCalculationResult {
  summary: FinancialFlowSummary;
  categoryAnalysis: CategoryBudgetAnalysis[];
  goalsProgress: SavingsGoalProgress[];
  criticalAlertCount: number;
  warningAlertCount: number;
}
