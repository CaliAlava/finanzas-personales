'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { formatUSD } from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export function CashflowChart() {
  const summary = useFinancialSummary();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = [
    {
      name: '1. Ingresos',
      monto: summary.totalIncome,
      color: '#10b981', // Emerald
      descripcion: 'Fijos + Extras del mes',
    },
    {
      name: '2. Ahorro Metas',
      monto: summary.savingsQuotas,
      color: '#06b6d4', // Cyan
      descripcion: 'Cuota obligatoria no negociable',
    },
    {
      name: '3. Fijos Mes',
      monto: summary.fixedExpenses,
      color: '#6366f1', // Indigo
      descripcion: 'Vivienda, Servicios, Seguros',
    },
    {
      name: '4. Variables',
      monto: summary.variableExpensesSpent,
      color: '#f59e0b', // Amber
      descripcion: 'Consumo diario registrado',
    },
    {
      name: '5. Remanente',
      monto: Math.max(0, summary.netSavingsBalance),
      color: '#14b8a6', // Teal
      descripcion: 'Sobrante libre disponible',
    },
  ];

  return (
    <Card className="border-border/80 bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            <CardTitle className="text-base font-semibold">
              Cascada del Flujo Financiero Mensual (USD)
            </CardTitle>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Filosofía: Págate a ti primero
          </span>
        </div>
        <CardDescription className="text-xs">
          Compara el total percibido frente a la distribución obligatoria y el saldo libre resultante.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full pt-4">
          {!isMounted ? (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
              Cargando gráfico de flujo...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-border bg-popover/95 p-2.5 shadow-md text-xs space-y-1">
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="text-base font-extrabold" style={{ color: item.color }}>
                            {formatUSD(item.monto)}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{item.descripcion}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="monto" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
