import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { MarketCard } from '@/components/features/MarketCard';
import { CreateMarketModal } from '@/components/features/CreateMarketModal';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getMarkets } from '@/lib/api';
import { useUser } from '@/hooks/useUser';

export function MarketsPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const { isAuthenticated } = useUser();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['markets'],
    queryFn: getMarkets,
  });

  const markets = data?.markets ?? [];
  const filtered = markets.filter(
    m =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageLayout>
      {/* Header */}
      <div
        style={{
          padding: '48px 0 32px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-light)] mb-2">
                  All Markets
                </p>
                <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800 }}>
                  Prediction Markets
                </h1>
              </div>

              {/* Create Market CTA — only for authenticated users */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <Button
                    id="markets-create-market"
                    onClick={() => setCreateOpen(true)}
                    className="gap-2 group"
                  >
                    <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    Create Market
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Search */}
            <div className="max-w-sm">
              <Input
                placeholder="Search markets…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                startIcon={<Search className="w-4 h-4" />}
                id="market-search"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '40px 0', flex: 1 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-[var(--danger)] font-medium">Failed to load markets.</p>
              <p className="text-[var(--text-muted)] text-sm mt-1">Please check the backend is running.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-[var(--text-heading)] font-medium">
                {search ? `No markets match "${search}"` : 'No markets yet'}
              </p>
              {!search && isAuthenticated && (
                <p className="text-[var(--text-muted)] text-sm mt-2">
                  Be the first to{' '}
                  <button
                    onClick={() => setCreateOpen(true)}
                    className="text-[var(--accent-light)] underline underline-offset-2 cursor-pointer"
                  >
                    create a market
                  </button>
                  !
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-[var(--text-muted)]">
                  {filtered.length} market{filtered.length !== 1 ? 's' : ''}
                  {search ? ` matching "${search}"` : ''}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((market, i) => (
                  <MarketCard key={market.id} market={market} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <CreateMarketModal open={createOpen} onOpenChange={setCreateOpen} />
    </PageLayout>
  );
}
