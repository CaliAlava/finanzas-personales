'use client';

import { useFinance } from '@/context/FinanceContext';

export function useFinanceData() {
  return useFinance();
}
