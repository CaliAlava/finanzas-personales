'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QuickTransactionDrawer } from './QuickTransactionDrawer';
import { GoalFormDialog } from './GoalFormDialog';
import { RecurringFormDialog } from './RecurringFormDialog';
import { Zap, Target, CalendarClock } from 'lucide-react';

interface QuickActionTriggerProps {
  className?: string;
}

export function QuickActionTrigger({ className }: QuickActionTriggerProps) {
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [recurringOpen, setRecurringOpen] = useState(false);

  return (
    <>
      <div className={`flex items-center gap-2 ${className || ''}`}>
        <Button
          onClick={() => setTransactionOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-950/20 gap-1.5"
        >
          <Zap className="h-4 w-4 fill-white" />
          <span>+ Registrar Movimiento</span>
        </Button>

        <div className="hidden sm:flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGoalOpen(true)}
            className="text-xs border-border/80 text-muted-foreground hover:text-foreground gap-1"
          >
            <Target className="h-3.5 w-3.5 text-emerald-400" />
            + Meta
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setRecurringOpen(true)}
            className="text-xs border-border/80 text-muted-foreground hover:text-foreground gap-1"
          >
            <CalendarClock className="h-3.5 w-3.5 text-blue-400" />
            + Fijo Recurrente
          </Button>
        </div>
      </div>

      <QuickTransactionDrawer
        open={transactionOpen}
        onOpenChange={setTransactionOpen}
      />

      <GoalFormDialog
        open={goalOpen}
        onOpenChange={setGoalOpen}
      />

      <RecurringFormDialog
        open={recurringOpen}
        onOpenChange={setRecurringOpen}
      />
    </>
  );
}
