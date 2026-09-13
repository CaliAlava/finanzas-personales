import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/database.types';
import type { ICategoriesService } from '@/types/contracts';
import { storageFallback, INITIAL_CATEGORIES } from './storageFallback';

class CategoriesService implements ICategoriesService {
  private hasSupabaseCredentials(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project')
    );
  }

  async getCategories(): Promise<Category[]> {
    if (!this.hasSupabaseCredentials()) {
      return storageFallback.getCategories();
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error || !data || data.length === 0) {
        return storageFallback.getCategories();
      }

      storageFallback.saveCategories(data);
      return data;
    } catch {
      return storageFallback.getCategories();
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const all = await this.getCategories();
    return all.find((c) => c.id === id) || null;
  }

  async updateCategoryLimit(id: string, newLimit: number): Promise<Category> {
    const all = storageFallback.getCategories();
    const index = all.findIndex((c) => c.id === id);

    if (this.hasSupabaseCredentials()) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .update({ monthly_budget_limit: newLimit })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          if (index !== -1) {
            all[index] = data;
            storageFallback.saveCategories(all);
          }
          return data;
        }
      } catch {
        // Fallback a local
      }
    }

    if (index !== -1) {
      all[index] = { ...all[index], monthly_budget_limit: newLimit };
      storageFallback.saveCategories(all);
      return all[index];
    }

    throw new Error(`Categoría con id ${id} no encontrada.`);
  }
}

export const categoriesService = new CategoriesService();
