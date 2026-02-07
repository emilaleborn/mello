'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  votingClosed,
}: PartyResultsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const ranked = calculatePartyRankings(aggregates, entries);
  const allVoted = party.members.length > 0 && voterIds.length >= party.members.length;
  const canReveal = allVoted || votingClosed;

  // Favorite distribution
  const favoriteCounts: Record<string, number> = {};
  if (canReveal && userVotes) {
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
        <h2 className="text-lg font-semibold text-white">Resultat</h2>
        {!canReveal && (
          <span className="text-xs text-zinc-400">
            Väntar på att alla röstar...
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {canReveal ? (
          <motion.div
            key="results"
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
                    className="w-full rounded-2xl bg-zinc-900 p-4 text-left transition-colors hover:bg-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          entry.rank === 1
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : entry.rank === 2
                              ? 'bg-zinc-400/20 text-zinc-300'
                              : entry.rank === 3
                                ? 'bg-orange-600/20 text-orange-400'
                                : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {entry.rank}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">
                          {entry.artist}
                        </p>
                        <p className="truncate text-sm text-zinc-400">
                          {entry.song}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {favCount > 0 && (
                          <span className="flex items-center gap-1 text-xs text-pink-400">
                            <span className="text-pink-500">&#9829;</span>
                            {favCount}
                          </span>
                        )}
                        <div className="text-right">
                          <p className="text-lg font-bold text-violet-400">
                            {entry.avg.toFixed(1)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {entry.count} röst{entry.count !== 1 ? 'er' : ''}
                          </p>
                        </div>
                        <svg
                          className={`h-4 w-4 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
                        <div className="mt-1 space-y-1 rounded-2xl bg-zinc-900/50 p-3">
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
                                <span className="text-sm text-zinc-300">
                                  {memberName}
                                  {isFav && (
                                    <span className="ml-1 text-pink-500">&#9829;</span>
                                  )}
                                </span>
                                <span className="text-sm font-medium text-violet-400">
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
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 rounded-2xl bg-zinc-900 py-10 text-center"
          >
            <span className="text-4xl">&#128274;</span>
            <p className="text-sm text-zinc-400">
              Resultaten visas när alla har röstat
            </p>
            <p className="text-xs text-zinc-500">
              {voterIds.length} av {party.members.length} har röstat
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {canReveal && maxFavorites > 0 && (
        <div className="rounded-2xl bg-zinc-900 p-4">
          <h3 className="mb-3 text-sm font-medium text-zinc-300">
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
                      <span className="text-zinc-300">{entry.artist}</span>
                      <span className="text-pink-400">
                        <span className="text-pink-500">&#9829;</span> {count}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-pink-600 to-pink-400"
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
