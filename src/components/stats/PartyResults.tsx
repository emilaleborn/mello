'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { ArtistImage } from '@/components/ui/ArtistImage';
import type { VoteAggregate, Entry, UserVote, Party } from '@/types';
import { calculatePartyRankings } from '@/lib/utils/statistics';

interface PartyResultsProps {
  entries: Entry[];
  aggregates: VoteAggregate;
  voterIds: string[];
  party: Party;
  userVotes?: Record<string, UserVote>;
  votingClosed: boolean;
}

export function PartyResults({
  entries,
  aggregates,
  voterIds,
  party,
  userVotes,
}: PartyResultsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const ranked = calculatePartyRankings(aggregates, entries);
  const hasAnyVotes = voterIds.length > 0;

  // Favorite distribution
  const favoriteCounts: Record<string, number> = {};
  if (userVotes) {
    Object.values(userVotes).forEach((vote) => {
      if (vote.favorite) {
        favoriteCounts[vote.favorite] = (favoriteCounts[vote.favorite] || 0) + 1;
      }
    });
  }

  const maxFavorites = Math.max(0, ...Object.values(favoriteCounts));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-extrabold tracking-tight text-white">Resultat</h2>
        <span className="text-xs text-[var(--foreground-muted)]">
          {voterIds.length} av {party.members.length} har röstat
        </span>
      </div>

      {hasAnyVotes ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          {ranked.map((entry, i) => {
            const isExpanded = expandedId === entry.id;
            const favCount = favoriteCounts[entry.id] || 0;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="w-full rounded-2xl bg-[var(--background-elevated)] p-4 text-left transition-colors hover:bg-[var(--background-surface)]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        entry.rank === 1
                          ? 'bg-yellow-500/20 text-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.3)]'
                          : entry.rank === 2
                            ? 'bg-zinc-400/20 text-zinc-300'
                            : entry.rank === 3
                              ? 'bg-orange-600/20 text-orange-400'
                              : 'bg-[var(--background-surface)] text-[var(--foreground-muted)]'
                      }`}
                    >
                      {entry.rank}
                    </span>

                    <ArtistImage entryId={entry.id} artistName={entry.artist} size={36} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">
                        {entry.artist}
                      </p>
                      <p className="truncate text-sm text-[var(--foreground-muted)]">
                        {entry.song}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {favCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-[var(--mello-magenta)]">
                          <Heart className="h-3.5 w-3.5 fill-current" />
                          {favCount}
                        </span>
                      )}
                      <div className="text-right">
                        <p className="score-display text-lg text-[var(--mello-gold)]">
                          {entry.avg.toFixed(1)}
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                          {entry.count} röst{entry.count !== 1 ? 'er' : ''}
                        </p>
                      </div>
                      <svg
                        className={`h-4 w-4 text-[var(--foreground-muted)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && userVotes && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 space-y-1 rounded-2xl bg-[var(--background-elevated)]/50 p-3">
                        {Object.entries(userVotes).map(([userId, vote]) => {
                          const rating = vote.ratings[entry.id];
                          const isFav = vote.favorite === entry.id;
                          const memberName =
                            party.memberNames[userId] || 'Okänd';

                          return (
                            <div
                              key={userId}
                              className="flex items-center justify-between py-1"
                            >
                              <span className="text-sm text-[var(--foreground)]">
                                {memberName}
                                {isFav && (
                                  <Heart className="ml-1 inline h-3 w-3 fill-current text-[var(--mello-magenta)]" />
                                )}
                              </span>
                              <span className="text-sm font-medium text-[var(--mello-gold)]">
                                {rating != null ? rating : '-'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-[var(--background-elevated)] py-10 text-center">
          <p className="text-sm text-[var(--foreground-muted)]">
            Ingen har röstat ännu
          </p>
        </div>
      )}

      {maxFavorites > 0 && (
        <div className="rounded-2xl bg-[var(--background-elevated)] p-4">
          <h3 className="section-label mb-3 text-[var(--foreground)]">
            Favoritfördelning
          </h3>
          <div className="space-y-2">
            {entries
              .filter((e) => (favoriteCounts[e.id] || 0) > 0)
              .sort(
                (a, b) =>
                  (favoriteCounts[b.id] || 0) - (favoriteCounts[a.id] || 0),
              )
              .map((entry) => {
                const count = favoriteCounts[entry.id] || 0;
                const pct = (count / maxFavorites) * 100;

                return (
                  <div key={entry.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--foreground)]">{entry.artist}</span>
                      <span className="text-[var(--mello-magenta)]">
                        <Heart className="inline h-3 w-3 fill-current text-[var(--mello-magenta)]" /> {count}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--background-surface)]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--mello-magenta)] to-[var(--mello-gold)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
