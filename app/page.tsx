'use client';

import React from 'react';
import { FinanceProvider, useFinance } from '@/context/FinanceContext';
import { HeaderMetrics } from '@/components/dashboard/HeaderMetrics';
import { CashflowChart } from '@/components/dashboard/CashflowChart';
import { CategoryBudgetGrid } from '@/components/dashboard/CategoryBudgetGrid';
import { SavingsGoalsList } from '@/components/dashboard/SavingsGoalsList';
import { RecurringTemplatesList } from '@/components/dashboard/RecurringTemplatesList';
import { RecentTransactionsTable } from '@/components/dashboard/RecentTransactionsTable';
import { BudgetAlertBanner } from '@/components/dashboard/BudgetAlertBanner';
import { QuickActionTrigger } from '@/components/forms/QuickActionTrigger';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  PiggyBank,
  RotateCcw,
  BarChart3,
  Target,
  CalendarClock,
  History,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

function DashboardContent() {
  const { resetToDemoData } = useFinance();

  const handleResetDemo = async () => {
    if (confirm('¿Restablecer el conjunto inicial de datos demo ($900 USD de ingresos y $600 USD de gastos divididos en rubros)?')) {
      await resetToDemoData();
    }
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Barra de Encabezado Superior */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border/50">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Finanzas Personales
                </h1>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[11px] px-2.5 py-0.5">
                  <DollarSign className="h-3 w-3 mr-0.5 text-emerald-400" />
                  USD
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Filosofía <span className="text-emerald-400 font-semibold">&quot;Págate a ti primero&quot;</span> • Flujo en cascada mensual
              </p>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas del Header */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetDemo}
            title="Recargar datos demo $900 / $600 USD"
            className="text-xs text-muted-foreground hover:text-foreground h-9 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Restablecer Demo</span>
          </Button>

          <QuickActionTrigger />
        </div>
      </header>

      {/* Banner de Alertas Preventivas */}
      <BudgetAlertBanner />

      {/* Tarjetas de Métricas Resumen (Header Metrics) */}
      <HeaderMetrics />

      {/* Navegación por Pestañas (Tabs) */}
      <Tabs defaultValue="overview" className="w-full space-y-6">
        <div className="border-b border-border/50 pb-2">
          <TabsList className="h-10 bg-muted/50 p-1 rounded-xl border border-border/60">
            <TabsTrigger
              value="overview"
              className="gap-2 px-3.5 text-xs font-semibold data-active:bg-background data-active:text-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Resumen General</span>
            </TabsTrigger>

            <TabsTrigger
              value="goals"
              className="gap-2 px-3.5 text-xs font-semibold data-active:bg-background data-active:text-foreground"
            >
              <Target className="h-4 w-4" />
              <span>Metas de Ahorro</span>
            </TabsTrigger>

            <TabsTrigger
              value="recurring"
              className="gap-2 px-3.5 text-xs font-semibold data-active:bg-background data-active:text-foreground"
            >
              <CalendarClock className="h-4 w-4" />
              <span>Gastos y Recurrentes</span>
            </TabsTrigger>

            <TabsTrigger
              value="transactions"
              className="gap-2 px-3.5 text-xs font-semibold data-active:bg-background data-active:text-foreground"
            >
              <History className="h-4 w-4" />
              <span>Historial de Movimientos</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Panel 1: Resumen General */}
        <TabsContent value="overview" className="space-y-6 outline-none">
          <CashflowChart />
          <CategoryBudgetGrid />
        </TabsContent>

        {/* Panel 2: Metas de Ahorro */}
        <TabsContent value="goals" className="outline-none">
          <SavingsGoalsList />
        </TabsContent>

        {/* Panel 3: Gastos y Recurrentes */}
        <TabsContent value="recurring" className="outline-none">
          <RecurringTemplatesList />
        </TabsContent>

        {/* Panel 4: Historial de Transacciones */}
        <TabsContent value="transactions" className="outline-none">
          <RecentTransactionsTable />
        </TabsContent>
      </Tabs>

      {/* Pie de Página / Indicador de Regla de Negocio */}
      <footer className="pt-8 border-t border-border/40 text-center text-xs text-muted-foreground space-y-1">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Regla Fundamental: Al iniciar el ciclo, las metas de ahorro se retienen como compromiso prioritario.
        </p>
        <p className="text-[11px] text-muted-foreground/70">
          Finanzas Personales • 100% en Dólares Estadounidenses (USD) • Persistencia Híbrida Offline / Supabase
        </p>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <FinanceProvider>
      <main className="min-h-screen bg-background">
        <DashboardContent />
      </main>
    </FinanceProvider>
  );
}
