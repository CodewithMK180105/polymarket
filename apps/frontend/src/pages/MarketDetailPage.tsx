import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Info } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { OrderForm } from '@/components/features/OrderForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getMarket } from '@/lib/api';
import { getMarketPercents, parseOrderbook } from '@/lib/utils';

export function MarketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['market', id],
    queryFn: () => getMarket(id!),
    enabled: !!id,
  });

  const market = data?.market;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          <Skeleton style={{ height: '20px', width: '120px' }} />
          <Skeleton style={{ height: '36px', width: '60%' }} />
          <Skeleton style={{ height: '80px', width: '100%' }} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton style={{ height: '200px' }} />
            </div>
            <Skeleton style={{ height: '340px' }} />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (isError || !market) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-[var(--danger)] font-semibold text-lg mb-2">Market not found</p>
          <p className="text-[var(--text-muted)] mb-6">
            This market may have been removed or the ID is incorrect.
          </p>
          <Button onClick={() => navigate('/markets')} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Markets
          </Button>
        </div>
      </PageLayout>
    );
  }

  const { yes: yesPercent, no: noPercent } = getMarketPercents(market);
  const isResolved = !!market.resolution;
  const yesOb = parseOrderbook(market.yesOrderbook);
  const noOb = parseOrderbook(market.noOrderbook);

  // Collect orderbook levels for display
  const yesLevels = Object.entries(yesOb)
    .map(([price, level]) => ({ price: Number(price), qty: level.availableQty }))
    .filter(l => l.qty > 0)
    .sort((a, b) => a.price - b.price)
    .slice(0, 5);

  const noLevels = Object.entries(noOb)
    .map(([price, level]) => ({ price: Number(price), qty: level.availableQty }))
    .filter(l => l.qty > 0)
    .sort((a, b) => a.price - b.price)
    .slice(0, 5);

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
          <Link to="/markets" className="hover:text-[var(--text-heading)] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Markets
          </Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)] truncate max-w-[240px]">{market.title}</span>
        </div>

        {/* Title + status */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {isResolved ? (
              <Badge variant={market.resolution === 'Yes' ? 'success' : 'destructive'}>
                {market.resolution === 'Yes'
                  ? <><CheckCircle className="w-3.5 h-3.5" /> Resolved YES</>
                  : <><XCircle className="w-3.5 h-3.5" /> Resolved NO</>
                }
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                Live
              </Badge>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, marginBottom: '8px' }}>
            {market.title}
          </h1>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            {market.description}
          </p>
        </div>

        {/* Probability bar */}
        <div
          className="p-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-bg)] mb-6"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Current Probability
            </span>
          </div>
          <div className="flex rounded-full overflow-hidden mb-3" style={{ height: '12px', background: 'var(--bg-tertiary)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${yesPercent}%` }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              style={{ background: 'var(--success)' }}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${noPercent}%` }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              style={{ background: 'var(--danger)' }}
            />
          </div>
          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--success)] tabular-nums">{yesPercent}¢</p>
              <p className="text-xs text-[var(--text-muted)] font-medium">YES</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--danger)] tabular-nums">{noPercent}¢</p>
              <p className="text-xs text-[var(--text-muted)] font-medium">NO</p>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Orderbook + Resolution Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Orderbook */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
              <div
                className="px-5 py-4 border-b border-[var(--border)]"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <h2 className="text-sm font-semibold text-[var(--text-heading)]">Orderbook</h2>
              </div>
              <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
                {/* YES side */}
                <div className="p-4">
                  <p className="text-xs font-semibold text-[var(--success)] mb-3 uppercase tracking-wider">
                    YES Asks
                  </p>
                  {yesLevels.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)]">No orders</p>
                  ) : (
                    <div className="space-y-1.5">
                      {yesLevels.map(l => (
                        <div key={l.price} className="flex justify-between items-center text-xs">
                          <span className="font-mono font-medium text-[var(--success)]">{l.price}¢</span>
                          <span className="text-[var(--text-muted)] tabular-nums">{l.qty.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* NO side */}
                <div className="p-4">
                  <p className="text-xs font-semibold text-[var(--danger)] mb-3 uppercase tracking-wider">
                    NO Asks
                  </p>
                  {noLevels.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)]">No orders</p>
                  ) : (
                    <div className="space-y-1.5">
                      {noLevels.map(l => (
                        <div key={l.price} className="flex justify-between items-center text-xs">
                          <span className="font-mono font-medium text-[var(--danger)]">{l.price}¢</span>
                          <span className="text-[var(--text-muted)] tabular-nums">{l.qty.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resolution info */}
            <div
              className="p-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-bg)] flex gap-3"
            >
              <Info className="w-5 h-5 text-[var(--accent-light)] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-heading)] mb-1">
                  Resolution Criteria
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {market.resolutionDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Order form */}
          <div>
            {isResolved ? (
              <div
                className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-bg)] text-center"
              >
                {market.resolution === 'Yes' ? (
                  <CheckCircle className="w-12 h-12 text-[var(--success)] mx-auto mb-3" />
                ) : (
                  <XCircle className="w-12 h-12 text-[var(--danger)] mx-auto mb-3" />
                )}
                <p className="font-semibold text-[var(--text-heading)] mb-1">
                  Market Resolved
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  This market resolved <strong>{market.resolution}</strong>. Trading is closed.
                </p>
              </div>
            ) : (
              <OrderForm market={market} />
            )}
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
}
