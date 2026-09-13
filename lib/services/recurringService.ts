import { supabase } from '@/lib/supabase';
import type {
  RecurringTemplate,
  RecurringTemplateInsert,
  RecurringTemplateUpdate,
} from '@/types/database.types';
import type { IRecurringService } from '@/types/contracts';
import { storageFallback } from './storageFallback';

class RecurringService implements IRecurringService {
  private hasSupabaseCredentials(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project')
    );
  }

  async getTemplates(): Promise<RecurringTemplate[]> {
    if (!this.hasSupabaseCredentials()) {
      return storageFallback.getRecurring();
    }

    try {
      const { data, error } = await supabase
        .from('recurring_templates')
        .select('*')
        .order('day_of_month', { ascending: true });

      if (error || !data) {
        return storageFallback.getRecurring();
      }

      storageFallback.saveRecurring(data);
      return data;
    } catch {
      return storageFallback.getRecurring();
    }
  }

  async createTemplate(template: RecurringTemplateInsert): Promise<RecurringTemplate> {
    const newTemplate: RecurringTemplate = {
      id: template.id || `rec-${Date.now()}`,
      category_id: template.category_id,
      name: template.name,
      amount: Number(template.amount),
      type: template.type,
      day_of_month: Number(template.day_of_month),
      is_active: template.is_active ?? true,
      created_at: new Date().toISOString(),
    };

    if (this.hasSupabaseCredentials()) {
      try {
        const { data, error } = await supabase
          .from('recurring_templates')
          .insert(template)
          .select()
          .single();

        if (!error && data) {
          const current = storageFallback.getRecurring();
          storageFallback.saveRecurring([data, ...current]);
          return data;
        }
      } catch {
        // Fallback
      }
    }

    const current = storageFallback.getRecurring();
    const updated = [newTemplate, ...current];
    storageFallback.saveRecurring(updated);
    return newTemplate;
  }

  async updateTemplate(
    id: string,
    updates: RecurringTemplateUpdate
  ): Promise<RecurringTemplate> {
    if (this.hasSupabaseCredentials()) {
      try {
        const { data, error } = await supabase
          .from('recurring_templates')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          const current = storageFallback.getRecurring();
          const idx = current.findIndex((r) => r.id === id);
          if (idx !== -1) {
            current[idx] = data;
            storageFallback.saveRecurring(current);
          }
          return data;
        }
      } catch {
        // Fallback
      }
    }

    const current = storageFallback.getRecurring();
    const idx = current.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Plantilla recurrente con id ${id} no encontrada.`);

    current[idx] = {
      ...current[idx],
      ...updates,
      amount: updates.amount !== undefined ? Number(updates.amount) : current[idx].amount,
      day_of_month: updates.day_of_month !== undefined ? Number(updates.day_of_month) : current[idx].day_of_month,
    };

    storageFallback.saveRecurring(current);
    return current[idx];
  }

  async deleteTemplate(id: string): Promise<void> {
    if (this.hasSupabaseCredentials()) {
      try {
        await supabase.from('recurring_templates').delete().eq('id', id);
      } catch {
        // Fallback
      }
    }

    const current = storageFallback.getRecurring();
    storageFallback.saveRecurring(current.filter((r) => r.id !== id));
  }

  async toggleActive(id: string, isActive: boolean): Promise<RecurringTemplate> {
    return this.updateTemplate(id, { is_active: isActive });
  }
}

export const recurringService = new RecurringService();
