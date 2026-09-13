'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { formatUSD } from '@/lib/utils';
import {
  Wallet,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export function HeaderMetrics() {
  const summary = useFinancialSummary();

  const isHealthy = summary.netSavingsBalance >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Métrica Héroe: Saldo Remanente Disponible */}
      <Card className="relative overflow-hidden border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-card to-card shadow-lg shadow-emerald-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90 flex items-center gap-1.5">
              <Wallet className="h-4 w-4 text-emerald-400" />
              Remanente Real
            </span>
            <Badge
              variant="outline"
              className={
                isHealthy
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30 text-[10px]'
              }
            >
              {isHealthy ? (
                <>
                  <ShieldCheck className="h-3 w-3 mr-1" /> Superávit
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" /> Déficit
                </>
              )}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {formatUSD(summary.netSavingsBalance)}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Libre tras apartar cuotas de metas y fijos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Ingresos Totales */}
      <Card className="border-border/80 bg-card">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Ingresos del Mes
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              USD
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatUSD(summary.totalIncome)}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>Fijos: <strong className="text-foreground">{formatUSD(summary.fixedIncome)}</strong></span>
              <span>•</span>
              <span>Extras: <strong className="text-emerald-400">{formatUSD(summary.extraIncome)}</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Ahorro Obligatorio Retenido */}
      <Card className="border-border/80 bg-card">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <PiggyBank className="h-4 w-4 text-emerald-400" />
              &quot;Págate a ti primero&quot;
            </span>
            <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-400">
              Retenido
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-emerald-400">
              {formatUSD(summary.savingsQuotas)}
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Fondo Total Metas:</span>
              <strong className="text-foreground">{formatUSD(summary.totalSavingsAccumulated)}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Gastos Totales (Fijos + Variables) */}
      <Card className="border-border/80 bg-card">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4 text-rose-400" />
              Gastos Totales
            </span>
            <span className="text-xs text-muted-foreground">
              {summary.totalIncome > 0
                ? `${Math.round(((summary.totalExpensesSpentTotal + summary.savingsQuotas) / summary.totalIncome) * 100)}% asignado`
                : '0%'}
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatUSD(summary.totalExpensesSpentTotal)}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>Fijos: <strong className="text-foreground">{formatUSD(summary.fixedExpenses)}</strong></span>
              <span>•</span>
              <span>Variables: <strong className="text-amber-400">{formatUSD(summary.variableExpensesSpent)}</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
