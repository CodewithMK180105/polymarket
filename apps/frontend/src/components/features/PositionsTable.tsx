import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import type { Position, Market } from '@/types';

interface PositionsTableProps {
  positions: Position[];
  markets: Market[];
  isLoading?: boolean;
}

type SortKey = 'market' | 'type' | 'qty';
type SortDir = 'asc' | 'desc';

export function PositionsTable({ positions, markets, isLoading = false }: PositionsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('qty');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const marketMap = useMemo(
    () => new Map(markets.map(m => [m.id, m])),
    [markets],
  );

  const sorted = useMemo(() => {
    return [...positions].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'market') {
        const ma = marketMap.get(a.marketId)?.title ?? '';
        const mb = marketMap.get(b.marketId)?.title ?? '';
        cmp = ma.localeCompare(mb);
      } else if (sortKey === 'type') {
        cmp = a.type.localeCompare(b.type);
      } else if (sortKey === 'qty') {
        cmp = a.qty - b.qty;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [positions, markets, sortKey, sortDir, marketMap]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3.5 h-3.5 text-[var(--accent-light)]" />
      : <ArrowDown className="w-3.5 h-3.5 text-[var(--accent-light)]" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} style={{ height: '64px', borderRadius: 'var(--radius)' }} />
        ))}
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)]"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="w-12 h-12 rounded-full bg-[var(--accent-dim)] flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-[var(--text-heading)] font-semibold text-sm">No positions yet</p>
        <p className="text-[var(--text-muted)] text-xs text-center max-w-[200px]">
          Explore markets and place your first trade to see positions here.
        </p>
        <Link to="/markets">
          <Button variant="outline" size="sm">Browse Markets</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
              {(['market', 'type', 'qty'] as SortKey[]).map(k => (
                <th
                  key={k}
                  onClick={() => handleSort(k)}
                  className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--text-heading)] transition-colors select-none"
                >
                  <span className="flex items-center gap-1.5">
                    {k === 'market' ? 'Market' : k === 'type' ? 'Side' : 'Quantity'}
                    <SortIcon k={k} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((pos, i) => {
              const market = marketMap.get(pos.marketId);
              return (
                <motion.tr
                  key={pos.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none',
                    background: 'var(--card-bg)',
                  }}
                  className="hover:bg-[var(--bg-secondary)] transition-colors duration-100"
                >
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-[var(--text-heading)] line-clamp-1">
                      {market?.title ?? pos.marketId.slice(0, 16) + '…'}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={pos.type === 'Yes' ? 'success' : 'destructive'}>
                      {pos.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-semibold text-[var(--text-heading)] tabular-nums">
                      {pos.qty.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {market && (
                      <Link to={`/markets/${market.id}`}>
                        <Button variant="ghost" size="sm">Trade</Button>
                      </Link>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {sorted.map((pos, i) => {
          const market = marketMap.get(pos.marketId);
          return (
            <motion.div
              key={pos.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent style={{ padding: '16px' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-heading)] line-clamp-2">
                        {market?.title ?? pos.marketId.slice(0, 16) + '…'}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant={pos.type === 'Yes' ? 'success' : 'destructive'} className="text-xs">
                          {pos.type}
                        </Badge>
                        <span className="text-xs text-[var(--text-muted)]">
                          {pos.qty.toLocaleString()} shares
                        </span>
                      </div>
                    </div>
                    {market && (
                      <Link to={`/markets/${market.id}`} className="shrink-0">
                        <Button variant="outline" size="sm">Trade</Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
