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
      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        <span className="text-sm font-medium text-emerald-400">Röstningen är öppen!</span>
        {memberCount > 0 && (
          <span className="ml-auto text-xs text-zinc-400">
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
    <div className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5">
      <span className="h-2 w-2 rounded-full bg-zinc-500" />
      <span className="text-sm font-medium text-zinc-400">Väntar på sändningsstart</span>
    </div>
  );
}
