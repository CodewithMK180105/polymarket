import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Coins,
  TrendingUp,
  Users,
  Activity,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { MarketCard } from '@/components/features/MarketCard';
import { ConnectWalletButton } from '@/components/features/ConnectWalletButton';
import { Button } from '@/components/ui/button';
import { SkeletonCard } from '@/components/ui/skeleton';
import { getMarkets } from '@/lib/api';
import { useUser } from '@/hooks/useUser';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'On-chain Settlement',
    description:
      'Every trade is settled transparently on Solana. Funds are secured by smart contracts with no custodial risk.',
  },
  {
    icon: Zap,
    title: 'Solflare-Native Auth',
    description:
      'Sign in instantly with your Solflare wallet. No email, no password — your keys, your identity.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Orderbook',
    description:
      'Live YES/NO orderbooks with atomic price matching. See liquidity depth and get the best fills.',
  },
  {
    icon: Coins,
    title: 'Split & Merge',
    description:
      'Convert $1 into YES + NO share pairs, or merge them back. Become a liquidity provider in any market.',
  },
];

export function HomePage() {
  const { isAuthenticated } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ['markets'],
    queryFn: getMarkets,
  });

  const markets = data?.markets ?? [];
  const previewMarkets = markets.slice(0, 3);

  return (
    <PageLayout>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '80px 0 100px',
          background: 'var(--bg)',
        }}
      >
        {/* Glow blobs */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70vw',
            height: '400px',
            background:
              'radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '20%',
            right: '-5%',
            width: '400px',
            height: '400px',
            background:
              'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
            style={{
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent-light)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-light)] animate-pulse" />
            Decentralized · Solana-powered · Real-time
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}
          >
            Trade on outcomes{' '}
            <span className="gradient-text">that matter</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              maxWidth: '560px',
              margin: '0 auto 40px',
              lineHeight: 1.6,
            }}
          >
            A decentralized prediction market where you can trade YES/NO shares on any verifiable
            outcome — powered by Solana and secured on-chain.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {isAuthenticated ? (
              <Link to="/markets">
                <Button size="lg" className="gap-2 group">
                  Explore Markets
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                </Button>
              </Link>
            ) : (
              <ConnectWalletButton size="lg" />
            )}
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="gap-2">
                How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Live stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center justify-center gap-8 mt-14 flex-wrap"
          >
            {[
              { icon: Activity, label: 'Active Markets', value: isLoading ? '…' : markets.length.toString() },
              { icon: TrendingUp, label: 'Total Volume', value: '$1.2M' },
              { icon: Users, label: 'Traders', value: '4,200+' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-2">
                <stat.icon className="w-4 h-4 text-[var(--accent-light)]" />
                <span className="text-xl font-bold text-[var(--text-heading)] tabular-nums">
                  {stat.value}
                </span>
                <span className="text-sm text-[var(--text-muted)]">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section
        style={{ padding: '80px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-light)] mb-2"
            >
              Why Polycast
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700 }}
            >
              Built for serious traders
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className="p-6 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent-border)] hover:shadow-[var(--shadow)] transition-all duration-200 group"
              >
                <div
                  className="w-11 h-11 rounded-[var(--radius)] flex items-center justify-center mb-4 transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--accent-border)',
                    color: 'var(--accent-light)',
                  }}
                >
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-heading)] mb-2">{feat.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Markets Preview ──────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-light)] mb-1">
                Live Now
              </p>
              <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700 }}>
                Open Markets
              </h2>
            </div>
            <Link to="/markets">
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0 group">
                View all
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : previewMarkets.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-muted)]">
              No markets available yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {previewMarkets.map((market, i) => (
                <MarketCard key={market.id} market={market} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────── */}
      <section
        style={{
          padding: '80px 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div
            className="max-w-2xl mx-auto p-10 rounded-[var(--radius-xl)] relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--accent-dim) 0%, rgba(6,182,212,0.08) 100%)',
              border: '1px solid var(--accent-border)',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center top, var(--accent-glow) 0%, transparent 60%)',
                pointerEvents: 'none',
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <h2
                style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, marginBottom: '12px' }}
              >
                Start trading outcomes<br />that matter
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 text-base max-w-md mx-auto">
                Connect your Solflare wallet and start participating in prediction markets in seconds.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {isAuthenticated ? (
                  <Link to="/markets">
                    <Button size="lg" className="gap-2">
                      Browse Markets <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <ConnectWalletButton size="lg" />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
