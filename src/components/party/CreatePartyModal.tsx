'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createParty } from '@/lib/firebase/parties';
import { useAuthStore } from '@/stores/authStore';

interface CreatePartyModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (partyId: string) => void;
}

export function CreatePartyModal({ open, onClose, onCreated }: CreatePartyModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useAuthStore((s) => s.user);

  const handleCreate = async () => {
    if (!user || !name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const party = await createParty(
        name.trim(),
        user.uid,
        user.displayName,
        user.photoURL,
      );
      setName('');
      onClose();
      onCreated?.(party.id);
    } catch {
      setError('Kunde inte skapa sällskapet. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-sm rounded-2xl bg-[var(--background-elevated)] border border-[var(--border)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 font-display text-lg font-extrabold text-white">Skapa sällskap</h2>

            <input
              type="text"
              placeholder="Namn på sällskapet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              className="mb-4 w-full rounded-xl bg-[var(--background-surface)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-muted)] outline-none focus:ring-2 focus:ring-[var(--mello-gold)]"
              autoFocus
            />

            {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-[var(--background-surface)] py-3 text-sm font-medium text-[var(--foreground)] active:opacity-80"
              >
                Avbryt
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim() || loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-[var(--mello-gold)] to-[var(--mello-magenta)] py-3 text-sm font-bold text-black disabled:opacity-50 active:opacity-90"
              >
                {loading ? 'Skapar...' : 'Skapa'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
