import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMarketPercents } from '@/lib/utils';
import type { Market } from '@/types';

interface MarketCardProps {
  market: Market;
  index?: number;
}

export function MarketCard({ market, index = 0 }: MarketCardProps) {
  const { yes: yesPercent, no: noPercent } = getMarketPercents(market);
  const isResolved = !!market.resolution;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
    >
      <Card
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          cursor: 'pointer',
        }}
        className="hover:border-[var(--accent-border)] hover:shadow-[var(--shadow-lg)] transition-all duration-200"
      >
        <CardContent style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Status badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {isResolved ? (
                <Badge variant={market.resolution === 'Yes' ? 'success' : 'destructive'}>
                  Resolved: {market.resolution}
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse inline-block" />
                  Live
                </Badge>
              )}
            </div>
            <TrendingUp className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-0.5" />
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-heading)',
              lineHeight: 1.4,
              flex: 1,
            }}
          >
            {market.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {market.description}
          </p>

          {/* YES / NO bar */}
          <div className="space-y-2">
            <div
              className="flex rounded-full overflow-hidden"
              style={{ height: '8px', background: 'var(--bg-tertiary)' }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${yesPercent}%` }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: index * 0.06 + 0.15 }}
                style={{ background: 'var(--success)', borderRadius: '9999px 0 0 9999px' }}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${noPercent}%` }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: index * 0.06 + 0.15 }}
                style={{ background: 'var(--danger)', borderRadius: '0 9999px 9999px 0' }}
              />
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--success)]">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                YES {yesPercent}¢
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--danger)]">
                NO {noPercent}¢
                <span className="w-2 h-2 rounded-full bg-[var(--danger)]" />
              </span>
            </div>
          </div>

          {/* CTA */}
          {!isResolved && (
            <Link to={`/markets/${market.id}`} className="mt-auto">
              <Button variant="outline" size="sm" className="w-full group">
                Trade
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
