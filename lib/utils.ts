import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea valores numéricos a dólares estadounidenses (USD)
 * Ej: 1250.5 -> $1,250.50
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

/**
 * Formatea porcentajes enteros o con un decimal
 * Ej: 84.6 -> 85%
 */
export function formatPercentage(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0%';
  return `${Math.round(value)}%`;
}
