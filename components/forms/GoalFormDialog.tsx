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
import { useFinance } from '@/context/FinanceContext';
import type { SavingsGoal, TermType } from '@/types/database.types';
import { Target, Sparkles, DollarSign } from 'lucide-react';

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalToEdit?: SavingsGoal | null;
}

const COLOR_PALETTE = [
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#14b8a6', // Teal
];

interface FormContentProps {
  goalToEdit?: SavingsGoal | null;
  onClose: () => void;
}

function GoalFormContent({ goalToEdit, onClose }: FormContentProps) {
  const { addGoal, editGoal } = useFinance();

  const [name, setName] = useState(goalToEdit ? goalToEdit.name : '');
  const [targetAmount, setTargetAmount] = useState(goalToEdit ? goalToEdit.target_amount.toString() : '');
  const [currentAmount, setCurrentAmount] = useState(goalToEdit ? goalToEdit.current_amount.toString() : '0');
  const [monthlyQuota, setMonthlyQuota] = useState(goalToEdit ? goalToEdit.monthly_quota.toString() : '');
  const [termType, setTermType] = useState<TermType>(goalToEdit ? goalToEdit.term_type : 'medium');
  const [deadline, setDeadline] = useState(goalToEdit?.deadline || '');
  const [color, setColor] = useState(goalToEdit?.color || '#10b981');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCalculateQuota = () => {
    const target = parseFloat(targetAmount) || 0;
    const current = parseFloat(currentAmount) || 0;
    const remaining = Math.max(0, target - current);

    if (deadline && remaining > 0) {
      const targetDate = new Date(deadline);
      const today = new Date();
      const diffMonths =
        (targetDate.getFullYear() - today.getFullYear()) * 12 +
        (targetDate.getMonth() - today.getMonth());

      const months = Math.max(1, diffMonths);
      const calculated = (remaining / months).toFixed(2);
      setMonthlyQuota(calculated);
    } else if (remaining > 0) {
      setMonthlyQuota((remaining / 12).toFixed(2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        target_amount: parseFloat(targetAmount) || 0,
        current_amount: parseFloat(currentAmount) || 0,
        monthly_quota: parseFloat(monthlyQuota) || 0,
        term_type: termType,
        deadline: deadline || null,
        color,
      };

      if (goalToEdit) {
        await editGoal(goalToEdit.id, payload);
      } else {
        await addGoal(payload);
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
        <div className="flex items-center gap-2 text-emerald-400">
          <Target className="h-5 w-5" />
          <DialogTitle>
            {goalToEdit ? 'Editar Meta de Ahorro' : 'Nueva Meta de Ahorro'}
          </DialogTitle>
        </div>
        <DialogDescription>
          &quot;Págate a ti primero&quot;: La cuota mensual se retendrá como gasto obligatorio antes de los variables.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="goal-name">Nombre de la meta *</Label>
          <Input
            id="goal-name"
            placeholder="Ej. Fondo de Emergencia, Vacaciones..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="goal-target">Monto Objetivo (USD) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="goal-target"
                type="number"
                step="0.01"
                min="1"
                placeholder="2500.00"
                className="pl-8"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="goal-current">Monto Actual Inicial (USD)</Label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="goal-current"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-8"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="goal-term">Plazo Estimado</Label>
            <select
              id="goal-term"
              value={termType}
              onChange={(e) => setTermType(e.target.value as TermType)}
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="short">Corto Plazo (&lt; 1 año)</option>
              <option value="medium">Mediano Plazo (1 - 3 años)</option>
              <option value="long">Largo Plazo (&gt; 3 años)</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="goal-deadline">Fecha Límite (Opcional)</Label>
            <Input
              id="goal-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="goal-quota" className="text-emerald-400 font-medium">
              Cuota Mensual Obligatoria (USD) *
            </Label>
            <button
              type="button"
              onClick={handleCalculateQuota}
              className="text-xs text-muted-foreground hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              Auto-calcular
            </button>
          </div>
          <div className="relative">
            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-emerald-400" />
            <Input
              id="goal-quota"
              type="number"
              step="0.01"
              min="0"
              placeholder="100.00"
              className="pl-8 border-emerald-500/30 focus-visible:ring-emerald-500"
              value={monthlyQuota}
              onChange={(e) => setMonthlyQuota(e.target.value)}
              required
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Monto que apartarás obligatoriamente cada mes al iniciar el ciclo.
          </p>
        </div>

        <div className="space-y-1.5 pt-1">
          <Label>Color de Identificación</Label>
          <div className="flex items-center gap-2">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full transition-transform ${
                  color === c ? 'ring-2 ring-foreground scale-110' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      <DialogFooter className="pt-2">
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
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-500 text-white"
        >
          {isSubmitting ? 'Guardando...' : goalToEdit ? 'Actualizar Meta' : 'Crear Meta'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function GoalFormDialog({
  open,
  onOpenChange,
  goalToEdit,
}: GoalFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        {open && (
          <GoalFormContent
            key={goalToEdit?.id || 'new'}
            goalToEdit={goalToEdit}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
