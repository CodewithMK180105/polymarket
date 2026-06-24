import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Copy, ExternalLink, LogOut, User, Activity, BarChart2, Calendar
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { getPositions, getHistory } from '@/lib/api';
import { copyToClipboard, formatBalance, truncateAddress } from '@/lib/utils';

export function ProfilePage() {
  const { token, isAuthenticated, isLoading: authLoading, address, signOut } = useUser();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!authLoading && !isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

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

  const positions = positionsData?.positions ?? [];
  const history = historyData?.history ?? [];
  const totalTrades = history.length;
  const buySells = history.filter(h => h.orderType === 'Buy' || h.orderType === 'Sell');
  const totalVolumeCents = buySells.reduce((acc, h) => acc + h.price * h.qty, 0);

  const handleCopy = async () => {
    if (!address) return;
    const ok = await copyToClipboard(address);
    if (ok) toast.success('Address copied to clipboard!');
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Wallet disconnected');
    navigate('/');
  };

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ padding: '40px 0', flex: 1 }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Profile header */}
          <Card>
            <CardContent style={{ padding: '28px' }}>
              <div className="flex items-start gap-4 flex-wrap">
                <Avatar className="w-16 h-16 shrink-0">
                  <AvatarFallback
                    style={{ fontSize: '20px' }}
                    className="bg-gradient-to-br from-[var(--accent)] to-[#06b6d4] text-white font-bold"
                  >
                    {address ? address.slice(0, 2).toUpperCase() : <User className="w-6 h-6" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
                    My Wallet
                  </h1>
                  {address ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <code
                        className="text-sm font-mono text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-[var(--radius-sm)] truncate max-w-[260px]"
                      >
                        {address}
                      </code>
                      <button
                        onClick={handleCopy}
                        className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-tertiary)] hover:border-[var(--accent-border)] hover:text-[var(--accent-light)] text-[var(--text-muted)] transition-all duration-150 cursor-pointer"
                        aria-label="Copy address"
                        title="Copy address"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`https://solscan.io/account/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-tertiary)] hover:border-[var(--accent-border)] hover:text-[var(--accent-light)] text-[var(--text-muted)] transition-all duration-150"
                        aria-label="View on Solscan"
                        title="View on Solscan"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : (
                    <Skeleton style={{ height: '20px', width: '260px' }} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Trading Stats</CardTitle>
            </CardHeader>
            <CardContent style={{ paddingTop: 0 }}>
              {histLoading || posLoading ? (
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} style={{ height: '60px' }} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
                  {[
                    { icon: Activity, label: 'Total Trades', value: totalTrades },
                    { icon: BarChart2, label: 'Open Positions', value: positions.length },
                    { icon: Calendar, label: 'Total Volume', value: formatBalance(totalVolumeCents) },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col items-center py-4 gap-1">
                      <Icon className="w-4 h-4 text-[var(--text-muted)] mb-1" />
                      <span className="text-2xl font-bold text-[var(--text-heading)] tabular-nums">
                        {value}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent style={{ paddingTop: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Theme toggle */}
              <div className="flex items-center justify-between px-1 py-3 rounded-[var(--radius-sm)] hover:bg-[var(--bg-secondary)] transition-colors">
                <div>
                  <p className="text-sm font-medium text-[var(--text-heading)]">Appearance</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Currently: {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={toggleTheme} id="profile-theme-toggle">
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>
              </div>

              <Separator />

              {/* Disconnect */}
              <div className="flex items-center justify-between px-1 py-3 rounded-[var(--radius-sm)] hover:bg-[var(--bg-secondary)] transition-colors">
                <div>
                  <p className="text-sm font-medium text-[var(--text-heading)]">Wallet Connection</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {address ? truncateAddress(address) : 'Connected'}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-1.5"
                  id="disconnect-wallet-btn"
                >
                  <LogOut className="w-3.5 h-3.5" /> Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </PageLayout>
  );
}
