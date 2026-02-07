'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { subscribeToParty } from '@/lib/firebase/parties';
import { subscribeToAggregates } from '@/lib/firebase/votes';
import { useCurrentEvent } from '@/hooks/useCurrentEvent';
import { useAuthStore } from '@/stores/authStore';
import { ENTRIES_BY_EVENT } from '@/constants/entries';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SharePartySheet } from '@/components/party/SharePartySheet';
import { PartyMemberList } from '@/components/party/PartyMemberList';
import { VoteTracker } from '@/components/voting/VoteTracker';
import { PartyResults } from '@/components/stats/PartyResults';
import type { Party, EventVotes, UserVote } from '@/types';

function PartyDetailContent({ partyId }: { partyId: string }) {
  const user = useAuthStore((s) => s.user);
  const [party, setParty] = useState<Party | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [aggregates, setAggregates] = useState<EventVotes | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, UserVote>>({});
  const currentEvent = useCurrentEvent();

  useEffect(() => {
    const unsub = subscribeToParty(partyId, setParty);
    return () => unsub();
  }, [partyId]);

  const eventId = currentEvent?.event.id ?? null;

  useEffect(() => {
    if (!eventId) return;
    const unsub = subscribeToAggregates(partyId, eventId, setAggregates);
    return () => unsub();
  }, [partyId, eventId]);

  // Fetch individual user votes for results reveal
  useEffect(() => {
    if (!eventId || !aggregates?.voterIds?.length) return;
    async function fetchUserVotes() {
      const snap = await getDocs(
        collection(db, 'parties', partyId, 'votes', eventId!, 'userVotes'),
      );
      const votes: Record<string, UserVote> = {};
      snap.forEach((doc) => {
        votes[doc.id] = doc.data() as UserVote;
      });
      setUserVotes(votes);
    }
    fetchUserVotes();
  }, [partyId, eventId, aggregates?.voterIds?.length]);

  if (!party) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--mello-gold)] border-t-transparent" />
      </div>
    );
  }

  const entries = eventId ? ENTRIES_BY_EVENT[eventId] ?? [] : [];
  const voterIds = aggregates?.voterIds ?? [];
  const votingClosed =
    currentEvent?.status === 'VOTING_CLOSED' ||
    currentEvent?.status === 'RESULTS' ||
    currentEvent?.status === 'SEASON_COMPLETE';
  const hasUserVoted = user ? voterIds.includes(user.uid) : false;

  return (
    <div className="min-h-dvh bg-[var(--background)] pb-24">
      <div className="border-b border-[var(--border)] px-4 py-4">
        <h1 className="text-xl font-bold text-white">{party.name}</h1>
        <p className="text-sm text-[var(--foreground-muted)]">
          {party.members.length} {party.members.length === 1 ? 'medlem' : 'medlemmar'}
        </p>
      </div>

      <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShareOpen(true)}
            className="flex-1 rounded-xl bg-gradient-to-r from-[var(--mello-gold)] to-[var(--mello-magenta)] py-3 text-sm font-bold text-black active:opacity-90"
          >
            Bjud in
          </button>
          {eventId && (
            <Link
              href={`/event/${eventId}`}
              className="flex flex-1 items-center justify-center rounded-xl bg-[var(--background-surface)] py-3 text-sm font-medium text-white active:opacity-80"
            >
              {hasUserVoted ? 'Ändra röst' : 'Rösta'}
            </Link>
          )}
        </div>

        {/* Current event section */}
        {currentEvent && (
          <div>
            <h2 className="mb-3 text-sm font-medium text-[var(--foreground-muted)]">
              {currentEvent.event.name}
            </h2>

            {/* Vote tracker */}
            <VoteTracker party={party} voterIds={voterIds} />
          </div>
        )}

        {/* Results */}
        {entries.length > 0 && aggregates?.aggregates && (
          <PartyResults
            entries={entries}
            aggregates={aggregates.aggregates}
            voterIds={voterIds}
            party={party}
            userVotes={Object.keys(userVotes).length > 0 ? userVotes : undefined}
            votingClosed={votingClosed}
          />
        )}

        {/* Members */}
        <div>
          <h2 className="mb-3 text-sm font-medium text-[var(--foreground-muted)]">Medlemmar</h2>
          <PartyMemberList
            party={party}
            currentUserId={user?.uid}
            isAdmin={user ? party.createdBy === user.uid : false}
          />
        </div>

        {/* Navigation links */}
        <div className="flex gap-3">
          <Link
            href={`/party/${partyId}/stats`}
            className="flex-1 rounded-xl bg-[var(--background-elevated)] py-3 text-center text-sm font-medium text-[var(--foreground)] active:opacity-80"
          >
            Statistik
          </Link>
          <Link
            href={`/party/${partyId}/leaderboard`}
            className="flex-1 rounded-xl bg-[var(--background-elevated)] py-3 text-center text-sm font-medium text-[var(--foreground)] active:opacity-80"
          >
            Topplista
          </Link>
        </div>
      </div>

      <SharePartySheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        joinCode={party.joinCode}
        partyName={party.name}
      />
    </div>
  );
}

export default function PartyDetailPage({
  params,
}: {
  params: Promise<{ partyId: string }>;
}) {
  const { partyId } = use(params);

  return (
    <AuthGuard>
      <PartyDetailContent partyId={partyId} />
    </AuthGuard>
  );
}
