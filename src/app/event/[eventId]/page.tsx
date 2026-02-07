'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { ChevronLeft } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { MELLO_EVENTS } from '@/constants/events';
import { ENTRIES_BY_EVENT } from '@/constants/entries';
import { useAuthStore } from '@/stores/authStore';
import { usePartyStore } from '@/stores/partyStore';
import { useVoting } from '@/hooks/useVoting';
import { useCurrentEvent } from '@/hooks/useCurrentEvent';
import { subscribeToUserParties } from '@/lib/firebase/parties';
import { subscribeToAggregates } from '@/lib/firebase/votes';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { EntryCard } from '@/components/voting/EntryCard';
import { VotingStatus } from '@/components/voting/VotingStatus';
import { PartyResults } from '@/components/stats/PartyResults';
import type { MelloEvent, Entry, EventVotes, UserVote } from '@/types';

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

  // Determine status — if not the current event, check if it's in the past
  const isCurrentEvent = currentEventState?.event.id === resolvedEventId;
  const status = isCurrentEvent
    ? currentEventState!.status
    : (() => {
        const today = new Date().toISOString().slice(0, 10);
        if (event && event.date < today) return 'RESULTS' as const;
        return 'UPCOMING' as const;
      })();

  const votingEnabled = status === 'VOTING_OPEN' || status === 'TODAY_COUNTDOWN';
  const isPastEvent = status === 'RESULTS' || status === 'VOTING_CLOSED' || status === 'SEASON_COMPLETE';

  const {
    draftRatings,
    draftFavorite,
    aggregates,
    savingEntries,
    rateEntry,
    toggleFavorite,
  } = useVoting(selectedPartyId, resolvedEventId);

  // Fetch party aggregates for past events (PartyResults)
  const [partyAggregates, setPartyAggregates] = useState<EventVotes | null>(null);
  const [partyUserVotes, setPartyUserVotes] = useState<Record<string, UserVote>>({});

  useEffect(() => {
    if (!isPastEvent || !selectedPartyId || !resolvedEventId) return;
    const unsub = subscribeToAggregates(selectedPartyId, resolvedEventId, setPartyAggregates);
    return () => unsub();
  }, [isPastEvent, selectedPartyId, resolvedEventId]);

  useEffect(() => {
    if (!isPastEvent || !selectedPartyId || !resolvedEventId) return;
    if (!partyAggregates?.voterIds?.length) return;
    async function fetchUserVotes() {
      const snap = await getDocs(
        collection(db, 'parties', selectedPartyId!, 'votes', resolvedEventId, 'userVotes'),
      );
      const votes: Record<string, UserVote> = {};
      snap.forEach((d) => {
        votes[d.id] = d.data() as UserVote;
      });
      setPartyUserVotes(votes);
    }
    fetchUserVotes();
  }, [isPastEvent, selectedPartyId, resolvedEventId, partyAggregates?.voterIds?.length]);

  if (!event) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--foreground-muted)]">Event hittades inte.</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--background)] pb-24">
      {/* Back link */}
      <div className="px-4 pt-4">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-sm text-[var(--foreground-muted)] active:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Alla tävlingar
        </Link>
      </div>

      {/* Event header */}
      <div className="border-b border-[var(--border)] px-4 pb-4 pt-2">
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
                onRate={(score) => rateEntry(entry.id, score)}
                onToggleFavorite={() => toggleFavorite(entry.id)}
                partyAvg={aggregates?.aggregates?.[entry.id]?.avg}
                partyVoteCount={aggregates?.aggregates?.[entry.id]?.count}
                savingStatus={savingEntries[entry.id]}
                disabled={!votingEnabled || !selectedPartyId}
              />
            </motion.div>
          ))}
        </div>

        {/* Party results for past events */}
        {isPastEvent && selectedParty && partyAggregates?.aggregates && entries.length > 0 && (
          <div className="mt-6">
            <PartyResults
              entries={entries}
              aggregates={partyAggregates.aggregates}
              voterIds={partyAggregates.voterIds ?? []}
              party={selectedParty}
              userVotes={Object.keys(partyUserVotes).length > 0 ? partyUserVotes : undefined}
              votingClosed={true}
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
