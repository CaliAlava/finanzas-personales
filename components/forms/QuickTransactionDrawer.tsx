'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useFinance } from '@/context/FinanceContext';
import {
  Zap,
  TrendingDown,
  TrendingUp,
  Target,
} from 'lucide-react';

interface QuickTransactionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultGoalId?: string | null;
}

type TransactionMode = 'variable' | 'extra_income' | 'goal_deposit';

interface DrawerContentProps {
  defaultGoalId?: string | null;
  onClose: () => void;
}

function QuickTransactionDrawerContent({
  defaultGoalId = null,
  onClose,
}: DrawerContentProps) {
  const { categories, goals, addTransaction } = useFinance();

  const [mode, setMode] = useState<TransactionMode>(
    defaultGoalId ? 'goal_deposit' : 'variable'
  );
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Categorías de gastos variables e ingresos
  const variableCategories = categories.filter((c) => c.type === 'variable_expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    variableCategories[0]?.id || ''
  );
  const [selectedGoalId, setSelectedGoalId] = useState<string>(
    defaultGoalId || goals[0]?.id || ''
  );
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determinar categoría activa según modo
  const activeCategoryId =
    mode === 'extra_income'
      ? incomeCategories.some((c) => c.id === selectedCategoryId)
        ? selectedCategoryId
        : incomeCategories[0]?.id || ''
      : variableCategories.some((c) => c.id === selectedCategoryId)
      ? selectedCategoryId
      : variableCategories[0]?.id || '';

  const handleQuickAdd = (increment: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + increment).toFixed(2));
  };

  const handleModeChange = (newMode: TransactionMode) => {
    setMode(newMode);
    if (newMode === 'variable') {
      setSelectedCategoryId(variableCategories[0]?.id || '');
    } else if (newMode === 'extra_income') {
      setSelectedCategoryId(incomeCategories[0]?.id || '');
    } else if (newMode === 'goal_deposit') {
      setSelectedGoalId(defaultGoalId || goals[0]?.id || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    setIsSubmitting(true);
    try {
      if (mode === 'goal_deposit') {
        const selectedGoal = goals.find((g) => g.id === selectedGoalId);
        await addTransaction({
          amount: parsedAmount,
          description: description.trim() || `Abono a: ${selectedGoal?.name || 'Meta'}`,
          category_id: null,
          goal_id: selectedGoalId || null,
          is_extra: false,
          date,
        });
      } else if (mode === 'extra_income') {
        const selectedCat = categories.find((c) => c.id === activeCategoryId);
        await addTransaction({
          amount: parsedAmount,
          description: description.trim() || `Ingreso Extra: ${selectedCat?.name || 'General'}`,
          category_id: activeCategoryId || null,
          goal_id: null,
          is_extra: true,
          date,
        });
      } else {
        // Gasto Variable
        const selectedCat = categories.find((c) => c.id === activeCategoryId);
        await addTransaction({
          amount: parsedAmount,
          description: description.trim() || selectedCat?.name || 'Gasto Diario',
          category_id: activeCategoryId || null,
          goal_id: null,
          is_extra: false,
          date,
        });
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400">
            <Zap className="h-5 w-5 fill-emerald-400" />
            <DialogTitle className="text-lg">Captura Rápida de Movimiento</DialogTitle>
          </div>
          <Badge variant="outline" className="text-xs text-muted-foreground">
            USD ($)
          </Badge>
        </div>
        <DialogDescription>
          Registro ultrarrápido (&lt; 5 seg) para no perder el control de tus gastos diarios.
        </DialogDescription>
      </DialogHeader>

      {/* Selector de Modo */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/60">
        <button
          type="button"
          onClick={() => handleModeChange('variable')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
            mode === 'variable'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingDown className="h-3.5 w-3.5" />
          Gasto Variable
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('extra_income')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
            mode === 'extra_income'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Ingreso Extra
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('goal_deposit')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
            mode === 'goal_deposit'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Target className="h-3.5 w-3.5" />
          Abono a Meta
        </button>
      </div>

      {/* Input de Monto Gigante */}
      <div className="space-y-1.5 pt-1">
        <Label htmlFor="quick-amount" className="text-xs uppercase tracking-wider text-muted-foreground">
          Monto en Dólares (USD)
        </Label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-2xl font-bold text-muted-foreground">$</span>
          <Input
            id="quick-amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            autoFocus
            className="pl-8 text-2xl sm:text-3xl font-extrabold h-14 bg-background border-2 border-emerald-500/30 focus-visible:border-emerald-500 rounded-xl"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Presets Rápidos */}
        <div className="flex items-center gap-1.5 pt-1">
          {[5, 10, 20, 50].map((inc) => (
            <button
              key={inc}
              type="button"
              onClick={() => handleQuickAdd(inc)}
              className="flex-1 py-1 text-xs font-medium rounded-md bg-muted/60 hover:bg-muted border border-border text-foreground transition-colors"
            >
              +{inc}$
            </button>
          ))}
        </div>
      </div>

      {/* Selección según modo */}
      {mode === 'goal_deposit' ? (
        <div className="space-y-1.5">
          <Label htmlFor="quick-goal" className="text-xs font-medium">
            Meta de Ahorro Destino
          </Label>
          <select
            id="quick-goal"
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          >
            {goals.length === 0 && <option value="">No hay metas creadas</option>}
            {goals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} (Actual: ${g.current_amount} / ${g.target_amount})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Categoría</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {(mode === 'variable' ? variableCategories : incomeCategories).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex items-center gap-1.5 p-2 rounded-lg border text-left text-xs transition-all ${
                  activeCategoryId === cat.id
                    ? 'border-emerald-500 bg-emerald-500/15 text-foreground font-semibold ring-1 ring-emerald-500'
                    : 'border-border/60 bg-muted/20 hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Descripción y Fecha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <Label htmlFor="quick-desc" className="text-xs font-medium">
            Descripción / Detalle (Opcional)
          </Label>
          <Input
            id="quick-desc"
            placeholder="Ej. Almuerzo, Uber, Factura extra..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="quick-date" className="text-xs font-medium">
            Fecha
          </Label>
          <Input
            id="quick-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 text-xs"
            required
          />
        </div>
      </div>

      <DialogFooter className="pt-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !amount}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex-1"
        >
          {isSubmitting ? 'Guardando...' : 'Registrar Movimiento'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function QuickTransactionDrawer({
  open,
  onOpenChange,
  defaultGoalId = null,
}: QuickTransactionDrawerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border p-6">
        {open && (
          <QuickTransactionDrawerContent
            key={defaultGoalId || 'default'}
            defaultGoalId={defaultGoalId}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
