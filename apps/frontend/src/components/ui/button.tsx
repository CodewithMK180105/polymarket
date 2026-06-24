import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from '@/lib/utils';

// We embed a tiny cva-like helper to avoid adding cva dependency
// Instead we'll use a simple approach with cn

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    'bg-[var(--accent)] text-white hover:bg-[var(--accent-light)] shadow-sm hover:shadow-[var(--shadow-glow)]',
  outline:
    'border border-[var(--border)] bg-transparent text-[var(--text-heading)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--accent-border)]',
  ghost:
    'bg-transparent text-[var(--text)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-heading)]',
  destructive:
    'bg-[var(--danger)] text-white hover:opacity-90 shadow-sm',
  success:
    'bg-[var(--success)] text-white hover:opacity-90 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm:   'h-8 px-3 text-xs rounded-[var(--radius-sm)] gap-1.5',
  md:   'h-9 px-4 text-sm rounded-[var(--radius)] gap-2',
  lg:   'h-11 px-6 text-sm rounded-[var(--radius)] gap-2',
  icon: 'h-9 w-9 rounded-[var(--radius)] p-0 justify-center',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-[150ms]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
