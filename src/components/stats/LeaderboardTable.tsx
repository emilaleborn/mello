'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import type { VoteAggregate, Entry } from '@/types';
import { MELLO_EVENTS } from '@/constants/events';
import { calculatePartyRankings, type RankedEntry } from '@/lib/utils/statistics';

interface LeaderboardTableProps {
  /** Map of eventId -> VoteAggregate */
  aggregatesByEvent: Record<string, VoteAggregate>;
  /** Map of eventId -> Entry[] */
  entriesByEvent: Record<string, Entry[]>;
  /** Only show entries from completed events (past today's date) */
  completedEventIds: string[];
}

const eventBadgeLabel: Record<string, string> = {};
MELLO_EVENTS.forEach((e) => {
  if (e.type === 'semifinal') eventBadgeLabel[e.id] = `DT${e.number}`;
  else if (e.type === 'finalkval') eventBadgeLabel[e.id] = 'FK';
  else eventBadgeLabel[e.id] = 'Final';
});

export function LeaderboardTable({
  aggregatesByEvent,
  entriesByEvent,
  completedEventIds,
}: LeaderboardTableProps) {
  const allRanked: (RankedEntry & { eventBadge: string })[] = useMemo(() => {
    const allEntries: (RankedEntry & { eventBadge: string })[] = [];

    for (const eventId of completedEventIds) {
      const entries = entriesByEvent[eventId] || [];
      const agg = aggregatesByEvent[eventId] || {};
      const ranked = calculatePartyRankings(agg, entries);
      ranked.forEach((r) => {
        allEntries.push({
          ...r,
          eventBadge: eventBadgeLabel[eventId] || eventId,
        });
      });
    }

    // Sort all entries by avg descending
    allEntries.sort((a, b) => b.avg - a.avg || b.count - a.count);
    allEntries.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    return allEntries;
  }, [aggregatesByEvent, entriesByEvent, completedEventIds]);

  if (allRanked.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-[var(--background-elevated)] py-10 text-center">
        <BarChart3 className="h-8 w-8 text-[var(--foreground-muted)]" />
        <p className="text-sm text-[var(--foreground-muted)]">
          Topplistan fylls på efter varje deltävling
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {allRanked.map((entry, i) => (
        <motion.div
          key={`${entry.eventId}-${entry.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className={`flex items-center gap-3 rounded-2xl p-4 ${
            entry.rank === 1
              ? 'bg-gradient-to-r from-yellow-500/10 to-[var(--background-elevated)] ring-1 ring-yellow-500/30'
              : entry.rank === 2
                ? 'bg-gradient-to-r from-zinc-400/10 to-[var(--background-elevated)] ring-1 ring-zinc-400/20'
                : entry.rank === 3
                  ? 'bg-gradient-to-r from-orange-600/10 to-[var(--background-elevated)] ring-1 ring-orange-500/20'
                  : 'bg-[var(--background-elevated)]'
          }`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              entry.rank === 1
                ? 'bg-yellow-500/20 text-yellow-400'
                : entry.rank === 2
                  ? 'bg-zinc-400/20 text-zinc-300'
                  : entry.rank === 3
                    ? 'bg-orange-600/20 text-orange-400'
                    : 'bg-[var(--background-surface)] text-[var(--foreground-muted)]'
            }`}
          >
            {entry.rank}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-white">{entry.artist}</p>
              <span className="shrink-0 rounded-md bg-[var(--mello-purple)]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--mello-purple-light)]">
                {entry.eventBadge}
              </span>
            </div>
            <p className="truncate text-sm text-[var(--foreground-muted)]">{entry.song}</p>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-[var(--mello-gold)]">
              {entry.avg.toFixed(1)}
            </p>
            <p className="text-xs text-[var(--foreground-muted)]">
              {entry.count} röst{entry.count !== 1 ? 'er' : ''}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
