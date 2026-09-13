'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <Card className={`border-dashed border-border/80 p-8 text-center bg-card/30 ${className}`}>
      <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="text-xs">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
