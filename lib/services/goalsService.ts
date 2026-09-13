import { supabase } from '@/lib/supabase';
import type {
  SavingsGoal,
  SavingsGoalInsert,
  SavingsGoalUpdate,
} from '@/types/database.types';
import type { IGoalsService } from '@/types/contracts';
import { storageFallback } from './storageFallback';

class GoalsService implements IGoalsService {
  private hasSupabaseCredentials(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project')
    );
  }

  async getGoals(): Promise<SavingsGoal[]> {
    if (!this.hasSupabaseCredentials()) {
      return storageFallback.getGoals();
    }

    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: true });

      if (error || !data) {
        return storageFallback.getGoals();
      }

      storageFallback.saveGoals(data);
      return data;
    } catch {
      return storageFallback.getGoals();
    }
  }

  async getGoalById(id: string): Promise<SavingsGoal | null> {
    const all = await this.getGoals();
    return all.find((g) => g.id === id) || null;
  }

  async createGoal(goal: SavingsGoalInsert): Promise<SavingsGoal> {
    const newGoal: SavingsGoal = {
      id: goal.id || `goal-${Date.now()}`,
      name: goal.name,
      target_amount: Number(goal.target_amount),
      current_amount: Number(goal.current_amount || 0),
      monthly_quota: Number(goal.monthly_quota || 0),
      term_type: goal.term_type,
      deadline: goal.deadline || null,
      color: goal.color || '#10b981',
      created_at: new Date().toISOString(),
    };

    if (this.hasSupabaseCredentials()) {
      try {
        const { data, error } = await supabase
          .from('savings_goals')
          .insert(goal)
          .select()
          .single();

        if (!error && data) {
          const current = storageFallback.getGoals();
          storageFallback.saveGoals([data, ...current]);
          return data;
        }
      } catch {
        // Fallback
      }
    }

    const current = storageFallback.getGoals();
    const updated = [newGoal, ...current];
    storageFallback.saveGoals(updated);
    return newGoal;
  }

  async updateGoal(id: string, updates: SavingsGoalUpdate): Promise<SavingsGoal> {
    if (this.hasSupabaseCredentials()) {
      try {
        const { data, error } = await supabase
          .from('savings_goals')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          const current = storageFallback.getGoals();
          const idx = current.findIndex((g) => g.id === id);
          if (idx !== -1) {
            current[idx] = data;
            storageFallback.saveGoals(current);
          }
          return data;
        }
      } catch {
        // Fallback
      }
    }

    const current = storageFallback.getGoals();
    const idx = current.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error(`Meta con id ${id} no encontrada.`);

    current[idx] = {
      ...current[idx],
      ...updates,
      target_amount: updates.target_amount !== undefined ? Number(updates.target_amount) : current[idx].target_amount,
      current_amount: updates.current_amount !== undefined ? Number(updates.current_amount) : current[idx].current_amount,
      monthly_quota: updates.monthly_quota !== undefined ? Number(updates.monthly_quota) : current[idx].monthly_quota,
    };

    storageFallback.saveGoals(current);
    return current[idx];
  }

  async deleteGoal(id: string): Promise<void> {
    if (this.hasSupabaseCredentials()) {
      try {
        await supabase.from('savings_goals').delete().eq('id', id);
      } catch {
        // Fallback
      }
    }

    const current = storageFallback.getGoals();
    storageFallback.saveGoals(current.filter((g) => g.id !== id));
  }

  async contributeToGoal(id: string, amount: number): Promise<SavingsGoal> {
    const goal = await this.getGoalById(id);
    if (!goal) throw new Error(`Meta no encontrada.`);
    const newCurrent = Number(goal.current_amount) + Number(amount);
    return this.updateGoal(id, { current_amount: newCurrent });
  }
}

export const goalsService = new GoalsService();
