'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SubmitVoteButtonProps {
  onSubmit: () => Promise<void>;
  disabled: boolean;
  hasVoted: boolean;
}

export function SubmitVoteButton({ onSubmit, disabled, hasVoted }: SubmitVoteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      disabled={disabled || loading}
      className="w-full rounded-2xl bg-gradient-to-r from-[var(--mello-gold)] to-[var(--mello-magenta)] py-4 text-base font-bold text-black disabled:opacity-40 disabled:grayscale"
    >
      {loading
        ? 'Skickar...'
        : hasVoted
          ? 'Uppdatera röst'
          : 'Skicka in röst'}
    </motion.button>
  );
}
