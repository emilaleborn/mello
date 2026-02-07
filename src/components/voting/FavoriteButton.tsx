'use client';

import { motion } from 'framer-motion';

interface FavoriteButtonProps {
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function FavoriteButton({ active, onToggle, disabled }: FavoriteButtonProps) {
  return (
    <button
      onClick={() => !disabled && onToggle()}
      disabled={disabled}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
        active
          ? 'bg-[var(--mello-magenta)]/20 text-[var(--mello-magenta)] shadow-[0_0_8px_rgba(224,64,160,0.3)]'
          : 'bg-[var(--background-surface)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
      } ${disabled ? 'opacity-50' : 'active:scale-90'}`}
      aria-label={active ? 'Ta bort som favorit' : 'Markera som favorit'}
    >
      <motion.div
        animate={active ? { scale: [1, 1.3, 0.9, 1.1, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={active ? 0 : 2}
          className="h-5 w-5"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>
    </button>
  );
}
