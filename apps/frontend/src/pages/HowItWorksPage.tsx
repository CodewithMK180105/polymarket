import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DollarSign, ArrowRight, Shuffle, GitMerge, ShieldCheck, TrendingUp } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const STEPS = [
  {
    number: '01',
    icon: ShieldCheck,
    title: 'Connect your Solflare wallet',
    description:
      'Sign in instantly with a Web3 signature — no email, no password. Your Solana wallet is your identity. The auth is secured via Supabase Web3.',
  },
  {
    number: '02',
    icon: DollarSign,
    title: 'Deposit funds',
    description:
      'Add USD balance to your account via the onramp. Your balance is tracked on-platform and used to buy YES/NO shares.',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Trade YES or NO shares',
    description:
      'Every market has a YES and NO orderbook. Buy YES if you think an outcome will happen; buy NO if you don\'t. Prices range from 1¢ to 99¢, representing implied probability.',
  },
  {
    number: '04',
    icon: Shuffle,
    title: 'Split & Merge positions',
    description:
      'Convert $1 into 1 YES + 1 NO share pair using Split. Use Merge to convert a matched YES + NO pair back into $1. Great for market-making.',
  },
  {
    number: '05',
    icon: GitMerge,
    title: 'Settle on resolution',
    description:
      'When a market resolves, YES holders get paid if the outcome is YES; NO holders get paid if the outcome is NO. Each winning share is worth $1 (100 cents).',
  },
];

const GLOSSARY = [
  { term: 'YES share', def: 'Pays $1 if the market resolves YES. Priced 1–99¢.' },
  { term: 'NO share', def: 'Pays $1 if the market resolves NO. Priced 1–99¢.' },
  { term: 'Split', def: 'Convert $1 → 1 YES + 1 NO. Always zero-sum.' },
  { term: 'Merge', def: 'Convert 1 YES + 1 NO → $1.' },
  { term: 'Orderbook', def: 'A list of open buy/sell orders at different prices.' },
  { term: 'Resolution', def: 'When a market officially settles YES or NO.' },
];

export function HowItWorksPage() {
  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <div
          style={{
            padding: '64px 0 48px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-light)] mb-3">
              Learn
            </p>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, marginBottom: '16px' }}>
              How Polycast Works
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto leading-relaxed">
              A step-by-step guide to prediction markets, YES/NO shares, and how to get started.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div style={{ padding: '64px 0' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="flex gap-5"
              >
                {/* Step indicator */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      background: 'var(--accent-dim)',
                      border: '2px solid var(--accent-border)',
                      color: 'var(--accent-light)',
                    }}
                  >
                    {step.number}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 w-0.5 min-h-[40px]" style={{ background: 'var(--border)' }} />
                  )}
                </div>
                {/* Content */}
                <div className="pb-8 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className="w-4 h-4 text-[var(--accent-light)]" />
                    <h2 className="text-base font-semibold text-[var(--text-heading)]">{step.title}</h2>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Glossary */}
        <div
          style={{
            padding: '64px 0',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2
              style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 700, marginBottom: '32px' }}
              className="text-center"
            >
              Glossary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GLOSSARY.map((item, i) => (
                <motion.div
                  key={item.term}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card>
                    <CardContent style={{ padding: '16px 20px' }}>
                      <p className="text-sm font-semibold text-[var(--text-heading)] mb-1">{item.term}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{item.def}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '64px 0', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
              Ready to trade?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              Connect your Solflare wallet and start exploring open prediction markets.
            </p>
            <Link to="/markets">
              <Button size="lg" className="gap-2 group">
                Browse Markets
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
}
