import { supabase } from '@/lib/supabase';
import type {
  Transaction,
  TransactionInsert,
  EnrichedTransaction,
} from '@/types/database.types';
import type { ITransactionsService } from '@/types/contracts';
import { storageFallback } from './storageFallback';
import { categoriesService } from './categoriesService';
import { goalsService } from './goalsService';

class TransactionsService implements ITransactionsService {
  private hasSupabaseCredentials(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project')
    );
  }

  private async enrichTransactions(rawList: Transaction[]): Promise<EnrichedTransaction[]> {
    const [cats, goals] = await Promise.all([
      categoriesService.getCategories(),
      goalsService.getGoals(),
    ]);

    const catMap = new Map(cats.map((c) => [c.id, c]));
    const goalMap = new Map(goals.map((g) => [g.id, g]));

    return rawList.map((tx) => ({
      ...tx,
      category: tx.category_id ? catMap.get(tx.category_id) || null : null,
      goal: tx.goal_id ? goalMap.get(tx.goal_id) || null : null,
    }));
  }

  async getTransactions(month?: number, year?: number): Promise<EnrichedTransaction[]> {
    let rawList: Transaction[] = [];

    if (this.hasSupabaseCredentials()) {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (!error && data) {
          rawList = data;
          storageFallback.saveTransactions(data);
        } else {
          rawList = storageFallback.getTransactions();
        }
      } catch {
        rawList = storageFallback.getTransactions();
      }
    } else {
      rawList = storageFallback.getTransactions();
    }

    if (month !== undefined && year !== undefined) {
      rawList = rawList.filter((tx) => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === month && txDate.getFullYear() === year;
      });
    }

    return this.enrichTransactions(rawList);
  }

  async createTransaction(tx: TransactionInsert): Promise<EnrichedTransaction> {
    const newTx: Transaction = {
      id: tx.id || `tx-${Date.now()}`,
      category_id: tx.category_id || null,
      goal_id: tx.goal_id || null,
      description: tx.description,
      amount: Number(tx.amount),
      date: tx.date || new Date().toISOString().split('T')[0],
      is_extra: tx.is_extra ?? false,
      created_at: new Date().toISOString(),
    };

    if (this.hasSupabaseCredentials()) {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .insert(tx)
          .select()
          .single();

        if (!error && data) {
          const current = storageFallback.getTransactions();
          storageFallback.saveTransactions([data, ...current]);
          const enriched = await this.enrichTransactions([data]);
          return enriched[0];
        }
      } catch {
        // Fallback
      }
    }

    const current = storageFallback.getTransactions();
    storageFallback.saveTransactions([newTx, ...current]);

    // Si abona a una meta de ahorro, incrementamos el monto actual de la meta
    if (newTx.goal_id) {
      await goalsService.contributeToGoal(newTx.goal_id, newTx.amount);
    }

    const enriched = await this.enrichTransactions([newTx]);
    return enriched[0];
  }

  async deleteTransaction(id: string): Promise<void> {
    if (this.hasSupabaseCredentials()) {
      try {
        await supabase.from('transactions').delete().eq('id', id);
      } catch {
        // Fallback
      }
    }

    const current = storageFallback.getTransactions();
    storageFallback.saveTransactions(current.filter((t) => t.id !== id));
  }
}

export const transactionsService = new TransactionsService();
