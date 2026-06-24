import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createOrder, splitTokens, mergeTokens } from '@/lib/api';
import { useUser } from '@/hooks/useUser';
import type { Market } from '@/types';

interface OrderFormProps {
  market: Market;
}

type Side = 'yes' | 'no';
type OrderType = 'buy' | 'sell';
type Tab = 'order' | 'split' | 'merge';

export function OrderForm({ market }: OrderFormProps) {
  const { token, isAuthenticated, signIn } = useUser();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<Tab>('order');
  const [side, setSide] = useState<Side>('yes');
  const [orderType, setOrderType] = useState<OrderType>('buy');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['balance'] });
    queryClient.invalidateQueries({ queryKey: ['positions'] });
    queryClient.invalidateQueries({ queryKey: ['history'] });
  };

  const handleOrder = async () => {
    if (!token) { toast.error('Connect your wallet first'); return; }
    const p = parseInt(price, 10);
    const q = parseInt(qty, 10);
    if (isNaN(p) || p < 1 || p > 99) { toast.error('Price must be 1–99 cents'); return; }
    if (isNaN(q) || q < 1) { toast.error('Quantity must be ≥ 1'); return; }

    setIsSubmitting(true);
    try {
      await createOrder(token, { marketId: market.id, side, type: orderType, price: p, qty: q });
      toast.success(`${orderType === 'buy' ? 'Bought' : 'Sold'} ${q} ${side.toUpperCase()} shares at ${p}¢`);
      setPrice('');
      setQty('');
      invalidate();
    } catch (e: any) {
      toast.error(e.message ?? 'Order failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSplit = async () => {
    if (!token) { toast.error('Connect your wallet first'); return; }
    const a = parseFloat(amount);
    if (isNaN(a) || a <= 0) { toast.error('Enter a valid amount'); return; }

    setIsSubmitting(true);
    try {
      await splitTokens(token, { marketId: market.id, amount: a });
      toast.success(`Split $${a} into ${a} YES + ${a} NO shares`);
      setAmount('');
      invalidate();
    } catch (e: any) {
      toast.error(e.message ?? 'Split failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMerge = async () => {
    if (!token) { toast.error('Connect your wallet first'); return; }
    const a = parseFloat(amount);
    if (isNaN(a) || a <= 0) { toast.error('Enter a valid amount'); return; }

    setIsSubmitting(true);
    try {
      await mergeTokens(token, { marketId: market.id, amount: a });
      toast.success(`Merged ${a} YES + ${a} NO shares into $${a}`);
      setAmount('');
      invalidate();
    } catch (e: any) {
      toast.error(e.message ?? 'Merge failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'order', label: 'Order' },
    { key: 'split', label: 'Split' },
    { key: 'merge', label: 'Merge' },
  ];

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-bg)]"
      style={{ overflow: 'hidden' }}
    >
      {/* Tab bar */}
      <div
        className="flex border-b border-[var(--border)]"
        style={{ background: 'var(--bg-secondary)' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm font-medium transition-all duration-150 cursor-pointer relative ${
              activeTab === tab.key
                ? 'text-[var(--text-heading)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                layoutId="order-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4">
        {activeTab === 'order' && (
          <>
            {/* Side toggle */}
            <div className="grid grid-cols-2 gap-2">
              {(['yes', 'no'] as Side[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={`py-2.5 rounded-[var(--radius)] text-sm font-semibold transition-all duration-150 cursor-pointer border ${
                    side === s && s === 'yes'
                      ? 'bg-[var(--success-dim)] border-[rgba(16,185,129,0.4)] text-[var(--success)]'
                      : side === s && s === 'no'
                      ? 'bg-[var(--danger-dim)] border-[rgba(239,68,68,0.4)] text-[var(--danger)]'
                      : 'bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Buy / Sell toggle */}
            <div className="grid grid-cols-2 gap-2">
              {(['buy', 'sell'] as OrderType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setOrderType(t)}
                  className={`py-2 rounded-[var(--radius-sm)] text-xs font-medium transition-all duration-150 cursor-pointer border ${
                    orderType === t
                      ? 'bg-[var(--accent-dim)] border-[var(--accent-border)] text-[var(--accent-light)]'
                      : 'bg-transparent border-[var(--border)] text-[var(--text-muted)]'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <Separator />

            <Input
              label="Price (cents)"
              type="number"
              min={1}
              max={99}
              placeholder="e.g. 60"
              value={price}
              onChange={e => setPrice(e.target.value)}
              endIcon="¢"
              hint="Price per share (1–99 cents)"
            />
            <Input
              label="Quantity"
              type="number"
              min={1}
              placeholder="e.g. 100"
              value={qty}
              onChange={e => setQty(e.target.value)}
              hint="Number of shares"
            />

            {price && qty && (
              <div
                className="flex justify-between items-center px-3 py-2 rounded-[var(--radius-sm)] text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <span className="text-[var(--text-muted)]">Total cost</span>
                <span className="font-semibold text-[var(--text-heading)] tabular-nums">
                  ${((parseInt(price || '0') * parseInt(qty || '0')) / 100).toFixed(2)}
                </span>
              </div>
            )}

            {isAuthenticated ? (
              <Button
                className="w-full"
                onClick={handleOrder}
                loading={isSubmitting}
                variant={side === 'yes' ? 'success' : 'destructive'}
              >
                {orderType === 'buy' ? 'Buy' : 'Sell'} {side.toUpperCase()}
              </Button>
            ) : (
              <Button className="w-full" onClick={() => signIn()}>
                Connect Wallet to Trade
              </Button>
            )}
          </>
        )}

        {(activeTab === 'split' || activeTab === 'merge') && (
          <>
            <div
              className="p-3 rounded-[var(--radius)] text-xs text-[var(--text-secondary)] leading-relaxed"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              {activeTab === 'split'
                ? '💡 Split converts $1 into 1 YES share + 1 NO share. Useful for providing liquidity.'
                : '💡 Merge converts 1 YES + 1 NO share back into $1. Useful for redeeming matched positions.'}
            </div>

            <Input
              label="Amount"
              type="number"
              min={0.01}
              step={0.01}
              placeholder="e.g. 10"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              startIcon="$"
            />

            {isAuthenticated ? (
              <Button
                className="w-full"
                onClick={activeTab === 'split' ? handleSplit : handleMerge}
                loading={isSubmitting}
                variant="outline"
              >
                {activeTab === 'split' ? 'Split Shares' : 'Merge Shares'}
              </Button>
            ) : (
              <Button className="w-full" onClick={() => signIn()}>
                Connect Wallet
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
