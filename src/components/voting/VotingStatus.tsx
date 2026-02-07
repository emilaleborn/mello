'use client';

import type { EventStatus, EventVotes, Party } from '@/types';

interface VotingStatusProps {
  status: EventStatus;
  aggregates: EventVotes | null;
  party: Party | null;
}

export function VotingStatus({ status, aggregates, party }: VotingStatusProps) {
  const voterCount = aggregates?.voterIds?.length ?? 0;
  const memberCount = party?.members.length ?? 0;

  if (status === 'VOTING_OPEN') {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-[var(--mello-gold)]/10 px-4 py-2.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--mello-gold)]" />
        <span className="text-sm font-medium text-[var(--mello-gold)]">Röstningen är öppen!</span>
        {memberCount > 0 && (
          <span className="ml-auto text-xs text-[var(--foreground-muted)]">
            {voterCount} av {memberCount} har röstat
          </span>
        )}
      </div>
    );
  }

  if (status === 'VOTING_CLOSED' || status === 'RESULTS') {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="text-sm font-medium text-red-400">Röstningen är stängd</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-xl bg-[var(--background-surface)] px-4 py-2.5">
      <span className="h-2 w-2 rounded-full bg-[var(--foreground-muted)]" />
      <span className="text-sm font-medium text-[var(--foreground-muted)]">Väntar på sändningsstart</span>
    </div>
  );
}
