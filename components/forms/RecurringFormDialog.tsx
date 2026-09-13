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
import type { RecurringTemplate, RecurringType } from '@/types/database.types';
import { CalendarClock, DollarSign } from 'lucide-react';

interface RecurringFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateToEdit?: RecurringTemplate | null;
  defaultType?: RecurringType;
}

interface FormContentProps {
  templateToEdit?: RecurringTemplate | null;
  defaultType: RecurringType;
  onClose: () => void;
}

function RecurringFormContent({
  templateToEdit,
  defaultType,
  onClose,
}: FormContentProps) {
  const { categories, addRecurring, editRecurring } = useFinance();

  const [type, setType] = useState<RecurringType>(
    templateToEdit ? templateToEdit.type : defaultType
  );
  const [name, setName] = useState(templateToEdit ? templateToEdit.name : '');
  const [amount, setAmount] = useState(
    templateToEdit ? templateToEdit.amount.toString() : ''
  );

  const eligibleCategories = categories.filter((c) => c.type === type);

  const [categoryId, setCategoryId] = useState(
    templateToEdit
      ? templateToEdit.category_id
      : eligibleCategories[0]?.id || ''
  );
  const [dayOfMonth, setDayOfMonth] = useState(
    templateToEdit ? templateToEdit.day_of_month.toString() : '1'
  );
  const [isActive, setIsActive] = useState(
    templateToEdit ? templateToEdit.is_active : true
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (newType: RecurringType) => {
    setType(newType);
    const compatible = categories.filter((c) => c.type === newType);
    if (compatible.length > 0) {
      setCategoryId(compatible[0].id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount || !categoryId) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        category_id: categoryId,
        amount: parseFloat(amount) || 0,
        type,
        day_of_month: parseInt(dayOfMonth, 10) || 1,
        is_active: isActive,
      };

      if (templateToEdit) {
        await editRecurring(templateToEdit.id, payload);
      } else {
        await addRecurring(payload);
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
          <CalendarClock className="h-5 w-5" />
          <DialogTitle>
            {templateToEdit
              ? 'Editar Plantilla Recurrente'
              : 'Nueva Plantilla Fija Recurrente'}
          </DialogTitle>
        </div>
        <DialogDescription>
          Se mantiene mes a mes de forma automática sin requerir registro manual repetitivo.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        {/* Toggle Tipo */}
        <div className="space-y-1">
          <Label>Tipo de Movimiento Fijo</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('fixed_expense')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                type === 'fixed_expense'
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                  : 'bg-card border-border text-muted-foreground hover:bg-muted/40'
              }`}
            >
              Gasto Fijo (Alquiler, Servicios...)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                type === 'income'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-card border-border text-muted-foreground hover:bg-muted/40'
              }`}
            >
              Ingreso Fijo (Sueldo, Renta...)
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="rec-name">Nombre descriptivo *</Label>
          <Input
            id="rec-name"
            placeholder="Ej. Sueldo mensual, Alquiler depto..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="rec-amount">Monto en USD *</Label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="rec-amount"
                type="number"
                step="0.01"
                min="1"
                placeholder="250.00"
                className="pl-8"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="rec-day">Día del Mes (1 - 31)</Label>
            <Input
              id="rec-day"
              type="number"
              min="1"
              max="31"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="rec-cat">Categoría Asociada *</Label>
          <select
            id="rec-cat"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          >
            {eligibleCategories.length === 0 && (
              <option value="">No hay categorías de este tipo</option>
            )}
            {eligibleCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Checkbox Activo */}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="rec-active"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-border text-emerald-500 focus:ring-emerald-400"
          />
          <Label htmlFor="rec-active" className="text-xs cursor-pointer">
            Plantilla activa para el ciclo mensual actual
          </Label>
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
          {isSubmitting
            ? 'Guardando...'
            : templateToEdit
            ? 'Actualizar Plantilla'
            : 'Guardar Plantilla'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function RecurringFormDialog({
  open,
  onOpenChange,
  templateToEdit,
  defaultType = 'fixed_expense',
}: RecurringFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        {open && (
          <RecurringFormContent
            key={templateToEdit?.id || 'new'}
            templateToEdit={templateToEdit}
            defaultType={defaultType}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
