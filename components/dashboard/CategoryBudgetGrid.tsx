'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBudgetAlerts } from '@/hooks/useBudgetAlerts';
import { formatUSD } from '@/lib/utils';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Layers,
} from 'lucide-react';

export function CategoryBudgetGrid() {
  const { categoryAnalysis, totalBudgetedVariables, totalSpentVariables } = useBudgetAlerts();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            Semáforo de Presupuesto por Categoría Variable
          </h3>
          <p className="text-xs text-muted-foreground">
            Control de límites mensuales para evitar sobregiros y fugas financieras.
          </p>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-border/50">
          Total Gastado: <strong className="text-foreground">{formatUSD(totalSpentVariables)}</strong> / {formatUSD(totalBudgetedVariables)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {categoryAnalysis.map((item) => {
          const { category, spent, budgetLimit, remaining, percentageUsed, status } = item;

          return (
            <Card
              key={category.id}
              className={`border transition-all ${
                status === 'critical'
                  ? 'border-rose-500/50 bg-rose-950/10'
                  : status === 'warning'
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : 'border-border/80 bg-card hover:border-border'
              }`}
            >
              <CardContent className="p-4 space-y-3">
                {/* Header de la Card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-semibold text-sm text-foreground truncate max-w-[170px]">
                      {category.name}
                    </span>
                  </div>

                  {/* Badge de Estatus */}
                  {status === 'critical' && (
                    <Badge variant="destructive" className="text-[10px] px-2 py-0.5 gap-1">
                      <AlertOctagon className="h-3 w-3" />
                      Sobregiro
                    </Badge>
                  )}
                  {status === 'warning' && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-amber-500/15 text-amber-400 border-amber-500/30 gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Atención
                    </Badge>
                  )}
                  {status === 'normal' && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Normal
                    </Badge>
                  )}
                </div>

                {/* Cifras en USD */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-bold text-foreground">
                      {formatUSD(spent)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      / {formatUSD(budgetLimit)}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-muted-foreground">
                    {percentageUsed}%
                  </span>
                </div>

                {/* Barra de Progreso */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        status === 'critical'
                          ? 'bg-rose-500'
                          : status === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percentageUsed)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                    <span>
                      {remaining >= 0 ? 'Disponible:' : 'Excedido por:'}
                    </span>
                    <span
                      className={`font-semibold ${
                        remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatUSD(Math.abs(remaining))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
