import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowDownUp, Scissors, Merge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { OrderHistory, Market } from '@/types';
import { useMemo } from 'react';

interface OrderHistoryFeedProps {
  history: OrderHistory[];
  markets: Market[];
  isLoading?: boolean;
  limit?: number;
}

const ORDER_TYPE_CONFIG = {
  Buy: { label: 'Buy', variant: 'success' as const, icon: ArrowUpDown },
  Sell: { label: 'Sell', variant: 'destructive' as const, icon: ArrowDownUp },
  Split: { label: 'Split', variant: 'default' as const, icon: Scissors },
  Merge: { label: 'Merge', variant: 'secondary' as const, icon: Merge },
};

export function OrderHistoryFeed({
  history,
  markets,
  isLoading = false,
  limit,
}: OrderHistoryFeedProps) {
  const marketMap = useMemo(
    () => new Map(markets.map(m => [m.id, m])),
    [markets],
  );

  const items = limit ? history.slice(0, limit) : history;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} style={{ height: '56px', borderRadius: 'var(--radius)' }} />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)]"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <span className="text-2xl">📋</span>
        <p className="text-sm text-[var(--text-muted)]">No order history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((order, i) => {
        const market = marketMap.get(order.marketId);
        const config = ORDER_TYPE_CONFIG[order.orderType];
        const Icon = config.icon;

        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
            className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] transition-colors duration-100"
          >
            {/* Icon */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'var(--text-secondary)',
              }}
            >
              <Icon className="w-4 h-4" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-heading)] truncate">
                {market?.title ?? `Market ${order.marketId.slice(0, 8)}…`}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={config.variant} className="text-[10px] py-0">
                  {config.label}
                </Badge>
                {order.price > 0 && (
                  <span className="text-xs text-[var(--text-muted)]">
                    @ {order.price}¢
                  </span>
                )}
                <span className="text-xs text-[var(--text-muted)]">
                  {order.qty.toLocaleString()} shares
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
