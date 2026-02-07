'use client';

import { UserAvatar } from '@/components/auth/UserAvatar';
import type { Party, EventVotes } from '@/types';

interface PartyMemberListProps {
  party: Party;
  aggregates?: EventVotes | null;
}

export function PartyMemberList({ party, aggregates }: PartyMemberListProps) {
  return (
    <div className="space-y-2">
      {party.members.map((uid) => {
        const hasVoted = aggregates?.voterIds?.includes(uid) ?? false;
        return (
          <div
            key={uid}
            className="flex items-center gap-3 rounded-xl bg-zinc-800/50 px-4 py-3"
          >
            <UserAvatar
              uid={uid}
              photoURL={party.memberPhotos[uid] ?? null}
              displayName={party.memberNames[uid] ?? '?'}
              size={36}
            />
            <span className="flex-1 truncate text-sm font-medium text-white">
              {party.memberNames[uid] ?? 'Okänd'}
            </span>
            {aggregates && (
              <span
                className={`text-xs font-medium ${hasVoted ? 'text-emerald-400' : 'text-zinc-500'}`}
              >
                {hasVoted ? 'Röstat' : 'Väntar'}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
