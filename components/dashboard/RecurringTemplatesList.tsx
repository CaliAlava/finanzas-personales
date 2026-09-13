'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFinance } from '@/context/FinanceContext';
import { formatUSD } from '@/lib/utils';
import { RecurringFormDialog } from '@/components/forms/RecurringFormDialog';
import type { RecurringTemplate, RecurringType } from '@/types/database.types';
import {
  CalendarClock,
  Plus,
  TrendingDown,
  TrendingUp,
  Pencil,
  Trash2,
  Calendar,
} from 'lucide-react';

export function RecurringTemplatesList() {
  const { recurringTemplates, categories, toggleRecurring, removeRecurring } = useFinance();
  const [editingTemplate, setEditingTemplate] = useState<RecurringTemplate | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [defaultType, setDefaultType] = useState<RecurringType>('fixed_expense');

  const catMap = new Map(categories.map((c) => [c.id, c]));

  const fixedIncomes = recurringTemplates.filter((r) => r.type === 'income');
  const fixedExpenses = recurringTemplates.filter((r) => r.type === 'fixed_expense');

  const totalFixedIncome = fixedIncomes
    .filter((r) => r.is_active)
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalFixedExpenses = fixedExpenses
    .filter((r) => r.is_active)
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const handleEdit = (template: RecurringTemplate) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleCreate = (type: RecurringType) => {
    setDefaultType(type);
    setEditingTemplate(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Eliminar la plantilla recurrente "${name}"?`)) {
      await removeRecurring(id);
    }
  };

  const renderTemplateRow = (item: RecurringTemplate) => {
    const category = catMap.get(item.category_id);

    return (
      <div
        key={item.id}
        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
          item.is_active
            ? 'bg-card border-border/80'
            : 'bg-muted/20 border-border/40 opacity-60'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-muted/50 border border-border/80 text-[11px] font-mono">
            <span className="text-[9px] uppercase text-muted-foreground">Día</span>
            <span className="font-bold text-foreground">{item.day_of_month}</span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">
                {item.name}
              </span>
              {!item.is_active && (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  Pausado
                </Badge>
              )}
            </div>

            {category && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span
              className={`text-base font-bold ${
                item.type === 'income' ? 'text-emerald-400' : 'text-foreground'
              }`}
            >
              {item.type === 'income' ? '+' : '-'}
              {formatUSD(item.amount)}
            </span>
            <span className="block text-[10px] text-muted-foreground">USD / mes</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleRecurring(item.id, !item.is_active)}
              className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
            >
              {item.is_active ? 'Pausar' : 'Activar'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(item)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(item.id, item.name)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold text-foreground">Plantillas Fijas Recurrentes</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Ingresos fijos y gastos fijos que se renuevan automáticamente cada ciclo mensual.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleCreate('income')}
            variant="outline"
            className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 gap-1.5"
          >
            <TrendingUp className="h-4 w-4" />
            + Ingreso Fijo
          </Button>
          <Button
            onClick={() => handleCreate('fixed_expense')}
            className="bg-blue-600 hover:bg-blue-500 text-white gap-1.5"
          >
            <TrendingDown className="h-4 w-4" />
            + Gasto Fijo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna Gastos Fijos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-border/40">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4 text-rose-400" />
              Gastos Fijos Recurrentes ({fixedExpenses.length})
            </span>
            <span className="text-xs font-mono font-bold text-foreground">
              Total: {formatUSD(totalFixedExpenses)}
            </span>
          </div>

          <div className="space-y-2">
            {fixedExpenses.length === 0 ? (
              <p className="text-xs text-muted-foreground p-4 text-center border border-dashed rounded-lg">
                No hay gastos fijos registrados.
              </p>
            ) : (
              fixedExpenses.map(renderTemplateRow)
            )}
          </div>
        </div>

        {/* Columna Ingresos Fijos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-border/40">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Ingresos Fijos Recurrentes ({fixedIncomes.length})
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Total: {formatUSD(totalFixedIncome)}
            </span>
          </div>

          <div className="space-y-2">
            {fixedIncomes.length === 0 ? (
              <p className="text-xs text-muted-foreground p-4 text-center border border-dashed rounded-lg">
                No hay ingresos fijos registrados.
              </p>
            ) : (
              fixedIncomes.map(renderTemplateRow)
            )}
          </div>
        </div>
      </div>

      <RecurringFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        templateToEdit={editingTemplate}
        defaultType={defaultType}
      />
    </div>
  );
}
