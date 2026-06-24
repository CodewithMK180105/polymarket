import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  PlusCircle,
  FileText,
  AlignLeft,
  Tag,
  Calendar,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createMarket } from '@/lib/api';
import { useUser } from '@/hooks/useUser';

const CATEGORIES = [
  'Politics',
  'Crypto',
  'Sports',
  'Science',
  'Technology',
  'Finance',
  'Entertainment',
  'Other',
] as const;

interface FormState {
  title: string;
  description: string;
  resolutionDescription: string;
  category: string;
  endDate: string;
}

const INITIAL_FORM: FormState = {
  title: '',
  description: '',
  resolutionDescription: '',
  category: '',
  endDate: '',
};

interface FormErrors {
  title?: string;
  description?: string;
  resolutionDescription?: string;
}

interface CreateMarketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMarketModal({ open, onOpenChange }: CreateMarketModalProps) {
  const { token, isAuthenticated } = useUser();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [succeeded, setSucceeded] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      createMarket(token!, {
        title: form.title.trim(),
        description: form.description.trim(),
        resolutionDescription: form.resolutionDescription.trim(),
        category: form.category || undefined,
        endDate: form.endDate || undefined,
      }),
    onSuccess: () => {
      setSucceeded(true);
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      toast.success('Market created successfully!');
      setTimeout(() => {
        onOpenChange(false);
        setForm(INITIAL_FORM);
        setSucceeded(false);
      }, 1600);
    },
    onError: (e: any) => {
      toast.error(e.message ?? 'Failed to create market');
    },
  });

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.title.trim() || form.title.trim().length < 5)
      errs.title = 'Title must be at least 5 characters';
    if (!form.description.trim() || form.description.trim().length < 10)
      errs.description = 'Description must be at least 10 characters';
    if (!form.resolutionDescription.trim() || form.resolutionDescription.trim().length < 5)
      errs.resolutionDescription = 'Resolution criteria is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (validate()) mutation.mutate();
  };

  const handleClose = (open: boolean) => {
    if (mutation.isPending) return; // don't close while submitting
    onOpenChange(open);
    if (!open) {
      setForm(INITIAL_FORM);
      setErrors({});
      setSucceeded(false);
      mutation.reset();
    }
  };

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-light)' }} />
            </div>
            Create a Market
          </DialogTitle>
          <DialogDescription>
            Propose a new prediction market. Once created, anyone can trade YES/NO shares on the
            outcome.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {succeeded ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'var(--success-dim, rgba(34,197,94,0.12))' }}
              >
                <CheckCircle className="w-8 h-8 text-[var(--success)]" />
              </div>
              <p className="text-lg font-semibold text-[var(--text-heading)]">Market Created!</p>
              <p className="text-sm text-[var(--text-muted)]">Updating the market listing…</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5 mt-2"
            >
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-heading)] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Market Question <span className="text-[var(--danger)]">*</span>
                </label>
                <Input
                  id="create-market-title"
                  placeholder="e.g. Will BTC reach $100,000 by end of 2025?"
                  {...field('title')}
                  error={errors.title}
                  maxLength={200}
                />
                <p className="text-xs text-[var(--text-muted)] text-right">
                  {form.title.length}/200
                </p>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-heading)] flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Description <span className="text-[var(--danger)]">*</span>
                </label>
                <textarea
                  id="create-market-description"
                  rows={3}
                  placeholder="Provide context about this market. What is being predicted?"
                  maxLength={1000}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius)',
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${errors.description ? 'var(--danger)' : 'var(--border)'}`,
                    color: 'var(--text-heading)',
                    fontSize: '14px',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 150ms ease',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => (e.target.style.borderColor = errors.description ? 'var(--danger)' : 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = errors.description ? 'var(--danger)' : 'var(--border)')}
                  {...field('description')}
                />
                {errors.description && (
                  <p className="text-xs text-[var(--danger)]">{errors.description}</p>
                )}
                <p className="text-xs text-[var(--text-muted)] text-right">
                  {form.description.length}/1000
                </p>
              </div>

              {/* Resolution Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-heading)] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Resolution Criteria <span className="text-[var(--danger)]">*</span>
                </label>
                <textarea
                  id="create-market-resolution"
                  rows={2}
                  placeholder="e.g. Resolves YES if CoinGecko shows BTC ≥ $100,000 on Dec 31, 2025."
                  maxLength={500}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius)',
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${errors.resolutionDescription ? 'var(--danger)' : 'var(--border)'}`,
                    color: 'var(--text-heading)',
                    fontSize: '14px',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 150ms ease',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => (e.target.style.borderColor = errors.resolutionDescription ? 'var(--danger)' : 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = errors.resolutionDescription ? 'var(--danger)' : 'var(--border)')}
                  {...field('resolutionDescription')}
                />
                {errors.resolutionDescription && (
                  <p className="text-xs text-[var(--danger)]">{errors.resolutionDescription}</p>
                )}
              </div>

              {/* Category + End Date (2-col) */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text-heading)] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="create-market-category"
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 12px',
                        paddingRight: '32px',
                        borderRadius: 'var(--radius)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        color: form.category ? 'var(--text-heading)' : 'var(--text-muted)',
                        fontSize: '14px',
                        outline: 'none',
                        appearance: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Select…</option>
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <span
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                      style={{ fontSize: 10 }}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                {/* End Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text-heading)] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    Expiry Date
                  </label>
                  <input
                    id="create-market-enddate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.endDate}
                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      borderRadius: 'var(--radius)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: form.endDate ? 'var(--text-heading)' : 'var(--text-muted)',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              {/* Outcome type — informational */}
              <div
                className="flex items-center gap-3 p-3 rounded-[var(--radius)]"
                style={{
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--accent-border)',
                }}
              >
                <div className="flex gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ background: 'rgba(34,197,94,0.18)', color: '#22c55e' }}
                  >
                    YES
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ background: 'rgba(239,68,68,0.18)', color: '#ef4444' }}
                  >
                    NO
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  All markets use binary YES/NO outcomes. Traders buy shares predicting the
                  resolution.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!succeeded && (
          <DialogFooter className="mt-0">
            <Button variant="ghost" onClick={() => handleClose(false)} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={mutation.isPending}
              disabled={mutation.isPending}
              id="create-market-submit"
              className="gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {mutation.isPending ? 'Creating…' : 'Create Market'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
