'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFinance } from '@/context/FinanceContext';
import { formatUSD } from '@/lib/utils';
import { GoalFormDialog } from '@/components/forms/GoalFormDialog';
import { QuickTransactionDrawer } from '@/components/forms/QuickTransactionDrawer';
import type { SavingsGoal, TermType } from '@/types/database.types';
import {
  Target,
  Plus,
  Calendar,
  Pencil,
  Trash2,
  Coins,
  ShieldCheck,
} from 'lucide-react';

export function SavingsGoalsList() {
  const { goals, removeGoal } = useFinance();
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const termLabels: Record<TermType, { label: string; badgeClass: string }> = {
    short: { label: 'Corto Plazo (< 1 año)', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    medium: { label: 'Mediano Plazo (1 - 3 años)', badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    long: { label: 'Largo Plazo (> 3 años)', badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  const handleQuickDeposit = (goalId: string) => {
    setDepositGoalId(goalId);
    setIsDepositOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar la meta "${name}"?`)) {
      await removeGoal(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del Módulo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-foreground">Metas de Ahorro</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Filosofía &quot;Págate a ti primero&quot;: Las cuotas mensuales se apartan antes de tus gastos variables.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Nueva Meta de Ahorro
        </Button>
      </div>

      {/* Lista de Metas */}
      {goals.length === 0 ? (
        <Card className="border-dashed border-border p-8 text-center bg-card/40">
          <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-foreground">No tienes metas de ahorro aún</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            Crea tu primera meta obligatoria para activar el flujo en cascada y apartar tu cuota mensual.
          </p>
          <Button onClick={handleCreate} variant="outline" className="text-xs">
            + Crear Mi Primera Meta
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const current = Number(goal.current_amount);
            const target = Number(goal.target_amount);
            const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
            const termInfo = termLabels[goal.term_type] || termLabels.medium;

            return (
              <Card
                key={goal.id}
                className="border-border/80 bg-card hover:border-border transition-all flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-4">
                  {/* Encabezado de la meta */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: goal.color }}
                        />
                        <h4 className="font-bold text-base text-foreground">
                          {goal.name}
                        </h4>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${termInfo.badgeClass}`}>
                        {termInfo.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(goal)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(goal.id, goal.name)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Cifras de Progreso */}
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-foreground">
                        {formatUSD(current)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Meta: <strong className="text-foreground">{formatUSD(target)}</strong>
                      </span>
                    </div>

                    <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: goal.color || '#10b981',
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
                      <span>Progreso: {percentage}%</span>
                      <span>Resta: {formatUSD(Math.max(0, target - current))}</span>
                    </div>
                  </div>

                  {/* Cuota Mensual Obligatoria ("Págate a ti primero") */}
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Cuota Mensual Obligatoria
                      </span>
                      <p className="text-sm font-extrabold text-emerald-300">
                        {formatUSD(goal.monthly_quota)} / mes
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleQuickDeposit(goal.id)}
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1"
                    >
                      <Coins className="h-3.5 w-3.5" />
                      Abonar
                    </Button>
                  </div>

                  {goal.deadline && (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Fecha límite estimada: {goal.deadline}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogs auxiliares */}
      <GoalFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        goalToEdit={editingGoal}
      />

      <QuickTransactionDrawer
        open={isDepositOpen}
        onOpenChange={setIsDepositOpen}
        defaultGoalId={depositGoalId}
      />
    </div>
  );
}
