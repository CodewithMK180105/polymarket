import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          style={{ width: i === lines - 1 ? '65%' : '100%', height: '14px' }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-bg)] p-5 space-y-4',
        className,
      )}
    >
      <Skeleton style={{ height: '18px', width: '60%' }} />
      <SkeletonText lines={2} />
      <Skeleton style={{ height: '32px', width: '100%', borderRadius: '8px' }} />
      <div className="flex gap-3">
        <Skeleton style={{ height: '36px', flex: 1 }} />
        <Skeleton style={{ height: '36px', flex: 1 }} />
      </div>
    </div>
  );
}

export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-bg)] p-5 space-y-2',
        className,
      )}
    >
      <Skeleton style={{ height: '14px', width: '40%' }} />
      <Skeleton style={{ height: '28px', width: '55%' }} />
      <Skeleton style={{ height: '12px', width: '30%' }} />
    </div>
  );
}
