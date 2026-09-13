'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useFinance } from '@/context/FinanceContext';
import { formatUSD } from '@/lib/utils';
import {
  History,
  Trash2,
  TrendingDown,
  TrendingUp,
  Target,
  Search,
  Calendar,
} from 'lucide-react';

export function RecentTransactionsTable() {
  const { transactions, removeTransaction } = useFinance();
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income' | 'goal'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter((tx) => {
    // Filtro por tipo
    if (filterType === 'expense' && (tx.is_extra || tx.goal_id)) return false;
    if (filterType === 'income' && !tx.is_extra) return false;
    if (filterType === 'goal' && !tx.goal_id) return false;

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const descMatch = tx.description.toLowerCase().includes(term);
      const catMatch = tx.category?.name.toLowerCase().includes(term);
      const goalMatch = tx.goal?.name.toLowerCase().includes(term);
      return descMatch || catMatch || goalMatch;
    }

    return true;
  });

  const handleDelete = async (id: string, desc: string) => {
    if (confirm(`¿Eliminar la transacción "${desc}"?`)) {
      await removeTransaction(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterType === 'all'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Todos ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterType === 'expense'
                ? 'bg-card text-rose-400 shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Variables
          </button>
          <button
            type="button"
            onClick={() => setFilterType('income')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterType === 'income'
                ? 'bg-card text-emerald-400 shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Extras
          </button>
          <button
            type="button"
            onClick={() => setFilterType('goal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterType === 'goal'
                ? 'bg-card text-blue-400 shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Metas
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar por descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs bg-card border-border/80"
          />
        </div>
      </div>

      {/* Lista de Transacciones */}
      {filteredTransactions.length === 0 ? (
        <Card className="border-dashed border-border p-8 text-center bg-card/40">
          <p className="text-xs text-muted-foreground">
            No se encontraron movimientos registrados con este criterio.
          </p>
        </Card>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
          <div className="divide-y divide-border/50">
            {filteredTransactions.map((tx) => {
              const isIncome = tx.is_extra;
              const isGoal = Boolean(tx.goal_id);

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Icono de Tipo */}
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : isGoal
                          ? 'bg-blue-500/15 text-blue-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {isIncome ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : isGoal ? (
                        <Target className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>

                    {/* Descripción y Meta/Categoría */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {tx.description}
                        </span>

                        {isIncome && (
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                            Extra
                          </Badge>
                        )}
                        {isGoal && (
                          <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/30">
                            Abono Meta
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{tx.date}</span>
                        {tx.category && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: tx.category.color }}
                              />
                              {tx.category.name}
                            </span>
                          </>
                        )}
                        {tx.goal && (
                          <>
                            <span>•</span>
                            <span className="text-blue-400">Meta: {tx.goal.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Monto y Acción */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-base font-bold font-mono ${
                        isIncome
                          ? 'text-emerald-400'
                          : isGoal
                          ? 'text-blue-400'
                          : 'text-foreground'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatUSD(tx.amount)}
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tx.id, tx.description)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
