'use client';

import { motion } from 'framer-motion';
import { VoteSlider } from './VoteSlider';
import { FavoriteButton } from './FavoriteButton';
import { PartyAverageScore } from './PartyAverageScore';
import type { Entry } from '@/types';

interface EntryCardProps {
  entry: Entry;
  rating: number | undefined;
  isFavorite: boolean;
  onRate: (score: number) => void;
  onToggleFavorite: () => void;
  partyAvg?: number;
  partyVoteCount?: number;
  hasVoted: boolean;
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
  hasVoted,
  disabled,
}: EntryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-zinc-900 p-4"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-sm font-bold text-violet-400">
            {entry.startNumber}
          </span>
          <div>
            <h3 className="font-bold text-white">{entry.artist}</h3>
            <p className="text-sm text-zinc-400">{entry.song}</p>
          </div>
        </div>
        <FavoriteButton active={isFavorite} onToggle={onToggleFavorite} disabled={disabled} />
      </div>

      <div className="mb-2">
        <VoteSlider value={rating} onChange={onRate} disabled={disabled} />
      </div>

      {hasVoted && partyAvg !== undefined && partyVoteCount !== undefined && (
        <div className="mt-3 border-t border-zinc-800 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Sällskapets snitt:</span>
            <PartyAverageScore avg={partyAvg} count={partyVoteCount} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
