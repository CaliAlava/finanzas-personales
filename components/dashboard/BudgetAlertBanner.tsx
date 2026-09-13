'use client';

import React from 'react';
import { useBudgetAlerts } from '@/hooks/useBudgetAlerts';
import { formatUSD } from '@/lib/utils';
import { AlertTriangle, AlertOctagon, Info } from 'lucide-react';

export function BudgetAlertBanner() {
  const { criticalAlerts, warningAlerts } = useBudgetAlerts();

  if (criticalAlerts.length === 0 && warningAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Alertas Críticas (Sobregiro) */}
      {criticalAlerts.length > 0 && (
        <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/20 text-rose-300 flex items-start gap-3">
          <AlertOctagon className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-rose-200">
              ¡Alerta de Sobregiro de Presupuesto!
            </p>
            <p className="text-muted-foreground">
              Has superado el 100% del límite asignado en:{' '}
              {criticalAlerts.map((c, i) => (
                <span key={c.category.id} className="font-bold text-rose-300">
                  {c.category.name} ({formatUSD(c.spent)} de {formatUSD(c.budgetLimit)})
                  {i < criticalAlerts.length - 1 ? ', ' : '.'}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* Alertas de Advertencia (80% - 100%) */}
      {warningAlerts.length > 0 && (
        <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/20 text-amber-300 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-amber-200">
              Aviso Preventivo de Presupuesto (Cerca del límite)
            </p>
            <p className="text-muted-foreground">
              Estás entre el 80% y 100% del límite mensual en:{' '}
              {warningAlerts.map((c, i) => (
                <span key={c.category.id} className="font-bold text-amber-300">
                  {c.category.name} ({c.percentageUsed}% usado)
                  {i < warningAlerts.length - 1 ? ', ' : '.'}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
