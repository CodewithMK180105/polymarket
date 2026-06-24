import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Menu,
  X,
  Zap,
  Copy,
  ExternalLink,
  LogOut,
  User,
  LayoutDashboard,
  PlusCircle,
  Wallet,
  Globe,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { truncateAddress, copyToClipboard, formatBalance } from '@/lib/utils';
import { getBalance } from '@/lib/api';
import { CreateMarketModal } from '@/components/features/CreateMarketModal';
import { toast } from 'sonner';

const NAV_LINKS = [
  { label: 'Markets', to: '/markets' },
  { label: 'How It Works', to: '/how-it-works' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, address, token, isLoading, signIn, signOut } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Fetch balance to show in dropdown
  const { data: balanceData } = useQuery({
    queryKey: ['balance'],
    queryFn: () => getBalance(token!),
    enabled: !!token && isAuthenticated,
    staleTime: 30_000,
  });

  const balance = balanceData?.balance ?? null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn();
    } catch (e) {
      toast.error('Failed to connect wallet. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Wallet disconnected');
    navigate('/');
  };

  const handleCopy = async () => {
    if (!address) return;
    const ok = await copyToClipboard(address);
    if (ok) toast.success('Address copied!');
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: scrolled ? 'var(--navbar-bg)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--navbar-border)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'all 250ms ease',
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-[var(--text-heading)] hover:opacity-80 transition-opacity shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[#06b6d4] flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-base tracking-tight">Polycast</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-[var(--text-heading)] bg-[var(--bg-tertiary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-secondary)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-heading)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Auth section */}
            {isLoading ? (
              <div className="w-20 h-9 skeleton rounded-[var(--radius)]" />
            ) : isAuthenticated && address ? (
              <>
                {/* Create Market button — visible on desktop */}
                <Button
                  id="navbar-create-market"
                  size="sm"
                  variant="outline"
                  onClick={() => setCreateOpen(true)}
                  className="hidden sm:flex gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Create Market
                </Button>

                {/* Wallet dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-2 px-2 py-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-border)] transition-all duration-150 cursor-pointer"
                      id="wallet-menu-trigger"
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-[10px]">
                          {address.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:flex flex-col items-start leading-tight">
                        <span className="text-xs font-medium text-[var(--text-heading)]">
                          {truncateAddress(address)}
                        </span>
                        {balance !== null && (
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {formatBalance(balance)}
                          </span>
                        )}
                      </div>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-64">
                    {/* Wallet info header */}
                    <div className="px-3 py-3 border-b border-[var(--border)]">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                          Connected Wallet
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[var(--text-secondary)] truncate mb-2">
                        {address}
                      </p>
                      <div className="flex items-center justify-between">
                        {balance !== null ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-[var(--text-muted)]">Balance</span>
                            <span className="text-sm font-semibold text-[var(--text-heading)]">
                              {formatBalance(balance)}
                            </span>
                          </div>
                        ) : (
                          <div className="w-16 h-4 skeleton rounded" />
                        )}
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[10px] font-medium text-green-500">Solana</span>
                        </div>
                      </div>
                    </div>

                    {/* Network info */}
                    <div className="px-3 py-2 border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span className="text-xs text-[var(--text-secondary)]">Network</span>
                        <span className="ml-auto text-xs font-medium text-[var(--text-heading)]">
                          Mainnet Beta
                        </span>
                      </div>
                    </div>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <LayoutDashboard className="w-4 h-4 text-[var(--text-muted)]" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 text-[var(--text-muted)]" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCreateOpen(true)}>
                      <PlusCircle className="w-4 h-4 text-[var(--text-muted)]" />
                      Create Market
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopy}>
                      <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                      Copy Address
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(`https://solscan.io/account/${address}`, '_blank')
                      }
                    >
                      <ExternalLink className="w-4 h-4 text-[var(--text-muted)]" />
                      View on Solscan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-[var(--danger)] focus:text-[var(--danger)] focus:bg-[var(--danger-dim)]"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect Wallet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                id="connect-wallet-btn"
                size="sm"
                loading={isSigningIn}
                onClick={handleSignIn}
              >
                Connect Wallet
              </Button>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-pointer"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                overflow: 'hidden',
                borderTop: '1px solid var(--border)',
                background: 'var(--navbar-bg)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {NAV_LINKS.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium ${
                        isActive
                          ? 'bg-[var(--bg-tertiary)] text-[var(--text-heading)]'
                          : 'text-[var(--text-secondary)]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                {isAuthenticated && (
                  <>
                    <NavLink
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium text-[var(--text-secondary)]"
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium text-[var(--text-secondary)]"
                    >
                      Profile
                    </NavLink>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setCreateOpen(true);
                      }}
                      className="px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium text-[var(--text-secondary)] text-left flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Create Market
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Create Market modal — rendered outside header to avoid stacking context issues */}
      <CreateMarketModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
