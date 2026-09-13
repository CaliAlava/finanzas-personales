'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type {
  SavingsGoal,
  SavingsGoalInsert,
  SavingsGoalUpdate,
  Category,
  RecurringTemplate,
  RecurringTemplateInsert,
  RecurringTemplateUpdate,
  TransactionInsert,
  EnrichedTransaction,
} from '@/types/database.types';
import type { FinanceContextType } from '@/types/contracts';
import { categoriesService } from '@/lib/services/categoriesService';
import { goalsService } from '@/lib/services/goalsService';
import { recurringService } from '@/lib/services/recurringService';
import { transactionsService } from '@/lib/services/transactionsService';
import { storageFallback } from '@/lib/services/storageFallback';

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [recurringTemplates, setRecurringTemplates] = useState<RecurringTemplate[]>([]);
  const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      storageFallback.initSeedData();
      const [cats, g, r, txs] = await Promise.all([
        categoriesService.getCategories(),
        goalsService.getGoals(),
        recurringService.getTemplates(),
        transactionsService.getTransactions(),
      ]);

      setCategories(cats);
      setGoals(g);
      setRecurringTemplates(r);
      setTransactions(txs);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar datos financieros';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Metas
  const addGoal = async (goal: SavingsGoalInsert): Promise<SavingsGoal> => {
    const created = await goalsService.createGoal(goal);
    setGoals((prev) => [created, ...prev]);
    return created;
  };

  const editGoal = async (id: string, updates: SavingsGoalUpdate): Promise<SavingsGoal> => {
    const updated = await goalsService.updateGoal(id, updates);
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    return updated;
  };

  const removeGoal = async (id: string): Promise<void> => {
    await goalsService.deleteGoal(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const depositToGoal = async (id: string, amount: number): Promise<SavingsGoal> => {
    const updated = await goalsService.contributeToGoal(id, amount);
    // Registrar la transacción de abono
    await transactionsService.createTransaction({
      goal_id: id,
      category_id: null,
      description: `Abono a meta: ${updated.name}`,
      amount,
      is_extra: false,
    });

    await refreshAll();
    return updated;
  };

  // Recurrentes
  const addRecurring = async (template: RecurringTemplateInsert): Promise<RecurringTemplate> => {
    const created = await recurringService.createTemplate(template);
    setRecurringTemplates((prev) => [created, ...prev]);
    return created;
  };

  const editRecurring = async (id: string, updates: RecurringTemplateUpdate): Promise<RecurringTemplate> => {
    const updated = await recurringService.updateTemplate(id, updates);
    setRecurringTemplates((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  };

  const removeRecurring = async (id: string): Promise<void> => {
    await recurringService.deleteTemplate(id);
    setRecurringTemplates((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleRecurring = async (id: string, isActive: boolean): Promise<RecurringTemplate> => {
    const updated = await recurringService.toggleActive(id, isActive);
    setRecurringTemplates((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  };

  // Transacciones
  const addTransaction = async (tx: TransactionInsert): Promise<EnrichedTransaction> => {
    const created = await transactionsService.createTransaction(tx);
    setTransactions((prev) => [created, ...prev]);
    // Si abonó a una meta, refrescar las metas
    if (tx.goal_id) {
      const updatedGoals = await goalsService.getGoals();
      setGoals(updatedGoals);
    }
    return created;
  };

  const removeTransaction = async (id: string): Promise<void> => {
    await transactionsService.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const resetToDemoData = async (): Promise<void> => {
    storageFallback.resetToDefaults();
    await refreshAll();
  };

  return (
    <FinanceContext.Provider
      value={{
        goals,
        recurringTemplates,
        transactions,
        categories,
        isLoading,
        error,
        addGoal,
        editGoal,
        removeGoal,
        depositToGoal,
        addRecurring,
        editRecurring,
        removeRecurring,
        toggleRecurring,
        addTransaction,
        removeTransaction,
        refreshAll,
        resetToDemoData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextType {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance debe ser utilizado dentro de un FinanceProvider');
  }
  return context;
}
