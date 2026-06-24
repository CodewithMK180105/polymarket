import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, startIcon, endIcon, type, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-heading)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <span className="absolute left-3 text-[var(--text-muted)] text-sm select-none pointer-events-none">
              {startIcon}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'w-full h-10 px-3 rounded-[var(--radius)] text-sm',
              'bg-[var(--bg-secondary)] border border-[var(--border)]',
              'text-[var(--text-heading)] placeholder:text-[var(--text-muted)]',
              'transition-all duration-[150ms]',
              'focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]',
              error && 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger-dim)]',
              startIcon && 'pl-8',
              endIcon && 'pr-8',
              className,
            )}
            {...props}
          />
          {endIcon && (
            <span className="absolute right-3 text-[var(--text-muted)] text-sm select-none pointer-events-none">
              {endIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
