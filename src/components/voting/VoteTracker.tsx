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
    <div className="rounded-2xl bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-300">Röstningsstatus</h3>
        <span className="text-xs text-zinc-400">
          {votedCount} av {totalMembers} har röstat
        </span>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-500"
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
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400">
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
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-700">
                  <span className="h-2 w-2 rounded-full bg-zinc-500" />
                </span>
              )}
              <span
                className={`text-sm ${hasVoted ? 'text-zinc-200' : 'text-zinc-500'}`}
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
