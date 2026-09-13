'use client';

import { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import type { CategoryBudgetAnalysis, BudgetAlertStatus } from '@/types/database.types';

export interface BudgetAlertsResult {
  categoryAnalysis: CategoryBudgetAnalysis[];
  criticalAlerts: CategoryBudgetAnalysis[];
  warningAlerts: CategoryBudgetAnalysis[];
  totalBudgetedVariables: number;
  totalSpentVariables: number;
  overallHealthScore: number;
}

export function useBudgetAlerts(): BudgetAlertsResult {
  const { categories, transactions } = useFinance();

  return useMemo(() => {
    // Filtrar solo categorías de gastos variables
    const variableCategories = categories.filter(
      (c) => c.type === 'variable_expense'
    );

    const categoryAnalysis: CategoryBudgetAnalysis[] = variableCategories.map(
      (cat) => {
        // Sumar transacciones asociadas a esta categoría
        const spent = transactions
          .filter((t) => t.category_id === cat.id && !t.is_extra)
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const budgetLimit = Number(cat.monthly_budget_limit || 0);
        const remaining = budgetLimit - spent;
        const percentageUsed =
          budgetLimit > 0 ? Math.round((spent / budgetLimit) * 100) : 0;

        let status: BudgetAlertStatus = 'normal';
        if (percentageUsed >= 100) {
          status = 'critical';
        } else if (percentageUsed >= 80) {
          status = 'warning';
        }

        return {
          category: cat,
          spent,
          budgetLimit,
          remaining,
          percentageUsed,
          status,
        };
      }
    );

    const totalBudgetedVariables = categoryAnalysis.reduce(
      (acc, item) => acc + item.budgetLimit,
      0
    );

    const totalSpentVariables = categoryAnalysis.reduce(
      (acc, item) => acc + item.spent,
      0
    );

    const criticalAlerts = categoryAnalysis.filter((c) => c.status === 'critical');
    const warningAlerts = categoryAnalysis.filter((c) => c.status === 'warning');

    // Puntuación de salud presupuestaria (0 - 100)
    const penalty = criticalAlerts.length * 30 + warningAlerts.length * 10;
    const overallHealthScore = Math.max(0, 100 - penalty);

    return {
      categoryAnalysis,
      criticalAlerts,
      warningAlerts,
      totalBudgetedVariables,
      totalSpentVariables,
      overallHealthScore,
    };
  }, [categories, transactions]);
}
