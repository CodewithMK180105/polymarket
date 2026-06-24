import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wallet, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';

interface ConnectWalletButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  redirectToDashboard?: boolean;
}

export function ConnectWalletButton({
  size = 'md',
  variant = 'default',
  redirectToDashboard = true,
}: ConnectWalletButtonProps) {
  const { isAuthenticated, isLoading, isSolflareInstalled, signIn } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated) return null;

  if (!isSolflareInstalled) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button
          variant={variant}
          size={size}
          onClick={() => window.open('https://solflare.com', '_blank')}
          className="gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Install Solflare Wallet
        </Button>
        <p className="text-xs text-[var(--text-muted)]">
          Solflare wallet is required to participate
        </p>
      </div>
    );
  }

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await signIn();
      toast.success('Wallet connected successfully!');
      if (redirectToDashboard) navigate('/dashboard');
    } catch (err: any) {
      if (err?.message?.includes('User rejected')) {
        toast.error('Connection rejected');
      } else {
        toast.error('Failed to connect. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleConnect}
      loading={isConnecting || isLoading}
      disabled={isConnecting || isLoading}
      className="gap-2 relative overflow-hidden group"
      id="hero-connect-wallet"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isConnecting ? (
          <motion.span
            key="connecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            Connecting...
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
