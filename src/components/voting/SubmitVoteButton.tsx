'use client';

import { useState } from 'react';

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
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className="w-full rounded-2xl bg-violet-600 py-4 text-base font-bold text-white disabled:opacity-40 active:bg-violet-700"
    >
      {loading
        ? 'Skickar...'
        : hasVoted
          ? 'Uppdatera röst'
          : 'Skicka in röst'}
    </button>
  );
}
