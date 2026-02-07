'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MELLO_EVENTS } from '@/constants/events';
import { ENTRIES_BY_EVENT } from '@/constants/entries';
import { useAuthStore } from '@/stores/authStore';
import { usePartyStore } from '@/stores/partyStore';
import { useVoting } from '@/hooks/useVoting';
import { useCurrentEvent } from '@/hooks/useCurrentEvent';
import { subscribeToUserParties } from '@/lib/firebase/parties';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { EntryCard } from '@/components/voting/EntryCard';
import { VotingStatus } from '@/components/voting/VotingStatus';
import { SubmitVoteButton } from '@/components/voting/SubmitVoteButton';
import type { MelloEvent, Entry } from '@/types';

function EventPageContent() {
  const params = useParams();
  const eventIdParam = params.eventId as string;
  const user = useAuthStore((s) => s.user);
  const { parties, setParties } = usePartyStore();
  const currentEventState = useCurrentEvent();

  // Resolve "current" eventId
  const resolvedEventId = eventIdParam === 'current'
    ? (currentEventState?.event.id ?? MELLO_EVENTS[0].id)
    : eventIdParam;

  const event: MelloEvent | undefined = MELLO_EVENTS.find((e) => e.id === resolvedEventId);
  const entries: Entry[] = ENTRIES_BY_EVENT[resolvedEventId] ?? [];

  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);

  // Subscribe to parties
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserParties(user.uid, setParties);
    return () => unsub();
  }, [user, setParties]);

  // Auto-select first party
  useEffect(() => {
    if (!selectedPartyId && parties.length > 0) {
      setSelectedPartyId(parties[0].id);
    }
  }, [parties, selectedPartyId]);

  const selectedParty = parties.find((p) => p.id === selectedPartyId) ?? null;
  const status = currentEventState?.event.id === resolvedEventId
    ? currentEventState.status
    : 'UPCOMING';

  const votingEnabled = status === 'VOTING_OPEN' || status === 'TODAY_COUNTDOWN';

  const {
    draftRatings,
    draftFavorite,
    aggregates,
    setDraftRating,
    setDraftFavorite,
    submitVote,
    hasVoted,
  } = useVoting(selectedPartyId, resolvedEventId);

  const allRated = entries.every((e) => draftRatings[e.id] !== undefined);

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--foreground-muted)]">Event hittades inte.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      {/* Event header */}
      <div className="border-b border-[var(--border)] px-4 py-4">
        <h1 className="text-xl font-bold text-white">{event.name}</h1>
        <p className="text-sm text-[var(--foreground-muted)]">
          {event.date} &middot; {event.time} &middot; {event.city}
        </p>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4">
        {/* Party selector */}
        {parties.length > 1 && (
          <select
            value={selectedPartyId ?? ''}
            onChange={(e) => setSelectedPartyId(e.target.value)}
            className="mb-4 w-full rounded-xl bg-[var(--background-surface)] px-4 py-3 text-white outline-none"
          >
            {parties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        {parties.length === 0 && (
          <div className="mb-4 rounded-xl bg-[var(--background-elevated)] p-4 text-center">
            <p className="text-sm text-[var(--foreground-muted)]">
              Gå med i ett sällskap för att rösta tillsammans!
            </p>
          </div>
        )}

        {/* Voting status */}
        {selectedParty && (
          <div className="mb-4">
            <VotingStatus status={status} aggregates={aggregates} party={selectedParty} />
          </div>
        )}

        {/* Entry list */}
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <EntryCard
                entry={entry}
                rating={draftRatings[entry.id]}
                isFavorite={draftFavorite === entry.id}
                onRate={(score) => setDraftRating(entry.id, score)}
                onToggleFavorite={() =>
                  setDraftFavorite(draftFavorite === entry.id ? null : entry.id)
                }
                partyAvg={aggregates?.aggregates?.[entry.id]?.avg}
                partyVoteCount={aggregates?.aggregates?.[entry.id]?.count}
                hasVoted={hasVoted}
                disabled={!votingEnabled || !selectedPartyId}
              />
            </motion.div>
          ))}
        </div>

        {/* Submit button */}
        {selectedPartyId && votingEnabled && (
          <div className="mt-6">
            <SubmitVoteButton
              onSubmit={submitVote}
              disabled={!allRated}
              hasVoted={hasVoted}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventPage() {
  return (
    <AuthGuard>
      <EventPageContent />
    </AuthGuard>
  );
}
