'use client';

import { useState } from 'react';
import { UserAvatar } from '@/components/auth/UserAvatar';
import { removeMember } from '@/lib/firebase/parties';
import type { Party, EventVotes } from '@/types';

interface PartyMemberListProps {
  party: Party;
  aggregates?: EventVotes | null;
  currentUserId?: string;
  isAdmin?: boolean;
}

export function PartyMemberList({ party, aggregates, currentUserId, isAdmin }: PartyMemberListProps) {
  const [removingUid, setRemovingUid] = useState<string | null>(null);

  async function handleRemove(uid: string) {
    if (!window.confirm(`Ta bort ${party.memberNames[uid] ?? 'denna medlem'} från gruppen?`)) return;
    setRemovingUid(uid);
    try {
      await removeMember(party.id, uid);
    } finally {
      setRemovingUid(null);
    }
  }

  return (
    <div className="space-y-2">
      {party.members.map((uid) => {
        const hasVoted = aggregates?.voterIds?.includes(uid) ?? false;
        const canRemove = isAdmin && uid !== currentUserId;
        return (
          <div
            key={uid}
            className="flex items-center gap-3 rounded-xl bg-[var(--background-surface)]/50 px-4 py-3"
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
                className={`text-xs font-medium ${hasVoted ? 'text-[var(--mello-gold)]' : 'text-[var(--foreground-muted)]'}`}
              >
                {hasVoted ? 'Röstat' : 'Väntar'}
              </span>
            )}
            {canRemove && (
              <button
                onClick={() => handleRemove(uid)}
                disabled={removingUid === uid}
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-[var(--foreground-muted)] hover:bg-[var(--background-surface)] hover:text-red-400 disabled:opacity-50"
                aria-label={`Ta bort ${party.memberNames[uid] ?? 'medlem'}`}
              >
                {removingUid === uid ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--foreground-muted)] border-t-transparent" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
