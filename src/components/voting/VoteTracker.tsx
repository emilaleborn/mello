'use client';

import type { Party } from '@/types';

interface VoteTrackerProps {
  party: Party;
  voterIds: string[];
}

export function VoteTracker({ party, voterIds }: VoteTrackerProps) {
  const voterSet = new Set(voterIds);
  const totalMembers = party.members.length;
  const votedCount = party.members.filter((m) => voterSet.has(m)).length;

  return (
    <div className="rounded-2xl bg-[var(--background-elevated)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--foreground)]">Röstningsstatus</h3>
        <span className="text-xs text-[var(--foreground-muted)]">
          {votedCount} av {totalMembers} har röstat
        </span>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-[var(--background-surface)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--mello-gold)] to-[var(--mello-magenta)] transition-all duration-500"
          style={{
            width: totalMembers > 0 ? `${(votedCount / totalMembers) * 100}%` : '0%',
          }}
        />
      </div>

      <div className="space-y-2">
        {party.members.map((memberId) => {
          const hasVoted = voterSet.has(memberId);
          const name = party.memberNames[memberId] || 'Okänd';

          return (
            <div key={memberId} className="flex items-center gap-2">
              {hasVoted ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--mello-gold)]/20 text-[var(--mello-gold)]">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--background-surface)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--foreground-muted)]" />
                </span>
              )}
              <span
                className={`text-sm ${hasVoted ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`}
              >
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
