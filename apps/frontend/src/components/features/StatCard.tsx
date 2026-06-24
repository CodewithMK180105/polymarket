import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  index?: number;
}

export function StatCard({
  label,
  value,
  icon,
  change,
  changeType = 'neutral',
  index = 0,
}: StatCardProps) {
  const changeColors: Record<'positive' | 'negative' | 'neutral', string> = {
    positive: 'var(--success)',
    negative: 'var(--danger)',
    neutral: 'var(--text-muted)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className="hover:shadow-[var(--shadow-lg)] transition-shadow duration-200">
        <CardContent style={{ padding: '20px' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.07 + 0.15 }}
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--text-heading)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {value}
              </motion.p>
              {change && (
                <p style={{ fontSize: '12px', color: changeColors[changeType], fontWeight: 500 }}>
                  {change}
                </p>
              )}
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius)',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-light)',
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
