'use client';

import { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import type { FinancialFlowSummary } from '@/types/database.types';

export interface ExtendedFinancialSummary extends FinancialFlowSummary {
  totalSavingsAccumulated: number;
  totalFixedAndSavingsCommitted: number;
  totalExpensesSpentTotal: number;
  savingsRatePercentage: number;
}

export function useFinancialSummary(): ExtendedFinancialSummary {
  const { goals, recurringTemplates, transactions } = useFinance();

  return useMemo(() => {
    // 1. Ingresos Fijos Activos
    const fixedIncome = recurringTemplates
      .filter((r) => r.type === 'income' && r.is_active)
      .reduce((sum, r) => sum + Number(r.amount), 0);

    // 2. Ingresos Extras del mes
    const extraIncome = transactions
      .filter((t) => t.is_extra)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // 3. Ingresos Totales
    const totalIncome = fixedIncome + extraIncome;

    // 4. Ahorro Obligatorio Retenido ("Págate a ti primero")
    const savingsQuotas = goals.reduce(
      (sum, g) => sum + Number(g.monthly_quota || 0),
      0
    );

    // 5. Gastos Fijos Obligatorios Activos
    const fixedExpenses = recurringTemplates
      .filter((r) => r.type === 'fixed_expense' && r.is_active)
      .reduce((sum, r) => sum + Number(r.amount), 0);

    // 6. Base Disponible para Gastos Variables
    // Fórmula: Total Ingresos - Ahorro Obligatorio - Gastos Fijos
    const availableForVariables = Math.max(
      0,
      totalIncome - savingsQuotas - fixedExpenses
    );

    // 7. Gastos Variables Ejecutados en el Mes (excluyendo abonos a metas y extras)
    const variableExpensesSpent = transactions
      .filter((t) => !t.is_extra && !t.goal_id)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // 8. Remanente Real del Mes
    // Fórmula: Base Disponible - Variables Ejecutados
    const netSavingsBalance = availableForVariables - variableExpensesSpent;

    // Métricas complementarias
    const totalSavingsAccumulated = goals.reduce(
      (sum, g) => sum + Number(g.current_amount || 0),
      0
    );

    const totalFixedAndSavingsCommitted = savingsQuotas + fixedExpenses;
    const totalExpensesSpentTotal = fixedExpenses + variableExpensesSpent;

    const savingsRatePercentage =
      totalIncome > 0
        ? Math.round(((savingsQuotas + Math.max(0, netSavingsBalance)) / totalIncome) * 100)
        : 0;

    return {
      fixedIncome,
      extraIncome,
      totalIncome,
      savingsQuotas,
      fixedExpenses,
      availableForVariables,
      variableExpensesSpent,
      netSavingsBalance,
      totalSavingsAccumulated,
      totalFixedAndSavingsCommitted,
      totalExpensesSpentTotal,
      savingsRatePercentage,
    };
  }, [goals, recurringTemplates, transactions]);
}
