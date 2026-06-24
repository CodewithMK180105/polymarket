import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Wallet, BarChart2, Activity, ArrowUpRight, ArrowDownRight, Plus, Minus } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { StatCard } from '@/components/features/StatCard';
import { PositionsTable } from '@/components/features/PositionsTable';
import { OrderHistoryFeed } from '@/components/features/OrderHistoryFeed';
import { SkeletonStat } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getBalance, getPositions, getHistory, getMarkets, onramp, offramp } from '@/lib/api';
import { formatBalance } from '@/lib/utils';
import { useUser } from '@/hooks/useUser';

type FundDialog = 'onramp' | 'offramp' | null;

export function DashboardPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fundDialog, setFundDialog] = useState<FundDialog>(null);
  const [fundAmount, setFundAmount] = useState('');

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: () => getBalance(token!),
    enabled: !!token,
  });

  const { data: positionsData, isLoading: posLoading } = useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions(token!),
    enabled: !!token,
  });

  const { data: historyData, isLoading: histLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => getHistory(token!),
    enabled: !!token,
  });

  const { data: marketsData } = useQuery({
    queryKey: ['markets'],
    queryFn: getMarkets,
  });

  const onrampMutation = useMutation({
    mutationFn: (amount: number) => onramp(token!, { amount }),
    onSuccess: (_, amount) => {
      toast.success(`$${amount.toFixed(2)} deposited successfully`);
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      setFundDialog(null);
      setFundAmount('');
    },
    onError: (e: any) => toast.error(e.message ?? 'Deposit failed'),
  });

  const offrampMutation = useMutation({
    mutationFn: (amount: number) => offramp(token!, { amount }),
    onSuccess: (_, amount) => {
      toast.success(`$${amount.toFixed(2)} withdrawn successfully`);
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      setFundDialog(null);
      setFundAmount('');
    },
    onError: (e: any) => toast.error(e.message ?? 'Withdrawal failed'),
  });

  const balance = balanceData?.balance ?? 0;
  const positions = positionsData?.positions ?? [];
  const history = historyData?.history ?? [];
  const markets = marketsData?.markets ?? [];

  const totalTrades = history.length;
  const buySellCount = history.filter(h => h.orderType === 'Buy' || h.orderType === 'Sell').length;

  const handleFund = () => {
    const a = parseFloat(fundAmount);
    if (isNaN(a) || a <= 0) { toast.error('Enter a valid amount'); return; }
    if (fundDialog === 'onramp') onrampMutation.mutate(a);
    else if (fundDialog === 'offramp') offrampMutation.mutate(a);
  };

  return (
    <PageLayout>
      <div style={{ padding: '40px 0', flex: 1 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-start justify-between gap-4 mb-8 flex-wrap"
          >
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: '4px' }}>
                Dashboard
              </h1>
              <p className="text-[var(--text-muted)] text-sm">Overview of your positions and activity</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFundDialog('onramp')}
                className="gap-1.5"
                id="deposit-btn"
              >
                <Plus className="w-3.5 h-3.5" /> Deposit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFundDialog('offramp')}
                className="gap-1.5"
                id="withdraw-btn"
              >
                <Minus className="w-3.5 h-3.5" /> Withdraw
              </Button>
            </div>
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {balanceLoading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonStat key={i} />)
            ) : (
              <>
                <StatCard
                  label="Wallet Balance"
                  value={formatBalance(balance)}
                  icon={<Wallet className="w-5 h-5" />}
                  index={0}
                />
                <StatCard
                  label="Open Positions"
                  value={positions.length}
                  icon={<BarChart2 className="w-5 h-5" />}
                  index={1}
                />
                <StatCard
                  label="Total Trades"
                  value={totalTrades}
                  icon={<Activity className="w-5 h-5" />}
                  change={`${buySellCount} buy/sell orders`}
                  changeType="neutral"
                  index={2}
                />
              </>
            )}
          </div>

          {/* Tabs: Positions / History */}
          <Tabs defaultValue="positions">
            <TabsList className="mb-6">
              <TabsTrigger value="positions" id="tab-positions">
                Positions ({positions.length})
              </TabsTrigger>
              <TabsTrigger value="history" id="tab-history">
                Order History ({history.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="positions">
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-[var(--text-heading)]">
                  Open Positions
                </h2>
                <PositionsTable
                  positions={positions}
                  markets={markets}
                  isLoading={posLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-[var(--text-heading)]">
                  Recent Activity
                </h2>
                <OrderHistoryFeed
                  history={history}
                  markets={markets}
                  isLoading={histLoading}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Deposit/Withdraw Dialog */}
      <Dialog open={!!fundDialog} onOpenChange={open => !open && setFundDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {fundDialog === 'onramp' ? 'Deposit Funds' : 'Withdraw Funds'}
            </DialogTitle>
            <DialogDescription>
              {fundDialog === 'onramp'
                ? 'Add USD balance to your Polycast account.'
                : `Withdraw USD from your Polycast account. Current balance: ${formatBalance(balance)}`}
            </DialogDescription>
          </DialogHeader>
          <Input
            label="Amount (USD)"
            type="number"
            min={0.01}
            step={0.01}
            placeholder="e.g. 50.00"
            value={fundAmount}
            onChange={e => setFundAmount(e.target.value)}
            startIcon="$"
            id="fund-amount-input"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setFundDialog(null)}>Cancel</Button>
            <Button
              onClick={handleFund}
              loading={onrampMutation.isPending || offrampMutation.isPending}
              variant={fundDialog === 'onramp' ? 'success' : 'destructive'}
            >
              {fundDialog === 'onramp' ? (
                <><ArrowUpRight className="w-4 h-4" /> Deposit</>
              ) : (
                <><ArrowDownRight className="w-4 h-4" /> Withdraw</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
