'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { VoteSlider } from './VoteSlider';
import { FavoriteButton } from './FavoriteButton';
import { PartyAverageScore } from './PartyAverageScore';
import type { Entry } from '@/types';
import type { SavingStatus } from '@/stores/votingStore';

interface EntryCardProps {
  entry: Entry;
  rating: number | undefined;
  isFavorite: boolean;
  onRate: (score: number) => void;
  onToggleFavorite: () => void;
  partyAvg?: number;
  partyVoteCount?: number;
  savingStatus?: SavingStatus;
  disabled?: boolean;
}

export function EntryCard({
  entry,
  rating,
  isFavorite,
  onRate,
  onToggleFavorite,
  partyAvg,
  partyVoteCount,
  savingStatus,
  disabled,
}: EntryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-[var(--background-elevated)] border-l-2 p-4 ${
        rating !== undefined
          ? 'border-l-[var(--mello-gold)] shadow-[-2px_0_8px_-2px_rgba(240,180,41,0.3)]'
          : 'border-[var(--mello-purple)]/40'
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--mello-gold)]/15 text-sm font-bold text-[var(--mello-gold)] border border-[var(--mello-gold)]/30">
            {entry.startNumber}
          </span>
          <div>
            <h3 className="font-bold text-white">{entry.artist}</h3>
            <p className="text-sm text-[var(--foreground-muted)]">{entry.song}</p>
          </div>
        </div>
        <FavoriteButton active={isFavorite} onToggle={onToggleFavorite} disabled={disabled} />
      </div>

      <div className="mb-2">
        <VoteSlider value={rating} onChange={onRate} disabled={disabled} />
      </div>

      <div className="mt-3 border-t border-[var(--border)] pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {partyAvg !== undefined && partyVoteCount !== undefined && partyVoteCount > 0 && (
              <>
                <span className="text-xs text-[var(--foreground-muted)]">Sällskapets snitt:</span>
                <PartyAverageScore avg={partyAvg} count={partyVoteCount} />
              </>
            )}
          </div>
          {savingStatus && (
            <span className="text-xs">
              {savingStatus === 'saving' && (
                <span className="text-[var(--foreground-muted)] animate-pulse">Sparar...</span>
              )}
              {savingStatus === 'saved' && (
                <span className="inline-flex items-center gap-1 text-green-400"><Check className="h-3.5 w-3.5" /> Sparat</span>
              )}
              {savingStatus === 'error' && (
                <span className="text-red-400">Fel vid sparning</span>
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
