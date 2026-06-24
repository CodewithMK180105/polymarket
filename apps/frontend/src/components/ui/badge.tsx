import * as React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'secondary';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-[var(--accent-dim)] text-[var(--accent-light)] border border-[var(--accent-border)]',
  success:
    'bg-[var(--success-dim)] text-[var(--success)] border border-[rgba(16,185,129,0.3)]',
  warning:
    'bg-[var(--warning-dim)] text-[var(--warning)] border border-[rgba(245,158,11,0.3)]',
  destructive:
    'bg-[var(--danger-dim)] text-[var(--danger)] border border-[rgba(239,68,68,0.3)]',
  outline:
    'bg-transparent text-[var(--text-secondary)] border border-[var(--border)]',
  secondary:
    'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-transparent',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium tracking-wide',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
