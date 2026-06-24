import { Link } from 'react-router-dom';
import { Zap, ExternalLink } from 'lucide-react';

const LINK_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Markets', to: '/markets' },
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'How It Works', to: '/how-it-works' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Solflare Wallet', href: 'https://solflare.com', external: true },
      { label: 'Solscan', href: 'https://solscan.io', external: true },
      { label: 'Solana Docs', href: 'https://docs.solana.com', external: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', to: '#' },
      { label: 'Privacy Policy', to: '#' },
      { label: 'Risk Disclosure', to: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-[var(--text-heading)] w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[#06b6d4] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-base tracking-tight">Polycast</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-[220px]">
              Decentralized prediction markets on Solana. Trade on outcomes that matter.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:border-[var(--border-strong)] transition-all duration-150"
                aria-label="Twitter"
              >
                <span className="text-xs font-bold">𝕏</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:border-[var(--border-strong)] transition-all duration-150"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {LINK_COLUMNS.map(col => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.label}>
                    {'href' in link ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-heading)] transition-colors duration-150 flex items-center gap-1"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </a>
                    ) : (
                      <Link
                        to={link.to!}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-heading)] transition-colors duration-150 block"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Polycast. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Built on{' '}
            <a
              href="https://solana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-light)] hover:underline"
            >
              Solana
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
