'use client';

import { useEffect, useState, use } from 'react';
import { doc, onSnapshot, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuthStore } from '@/stores/authStore';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { LeaderboardTable } from '@/components/stats/LeaderboardTable';
import { MELLO_EVENTS } from '@/constants/events';
import { ENTRIES_BY_EVENT } from '@/constants/entries';
import type { Party, VoteAggregate } from '@/types';

function LeaderboardContent({ partyId }: { partyId: string }) {
  const user = useAuthStore((s) => s.user);
  const [party, setParty] = useState<Party | null>(null);
  const [aggregatesByEvent, setAggregatesByEvent] = useState<
    Record<string, VoteAggregate>
  >({});
  const [completedEventIds, setCompletedEventIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, 'parties', partyId), (snap) => {
      if (snap.exists()) {
        setParty({ id: snap.id, ...snap.data() } as Party);
      }
    });
    return () => unsub();
  }, [partyId, user]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const completed = MELLO_EVENTS.filter((e) => e.date < today).map((e) => e.id);
    setCompletedEventIds(completed);
  }, []);

  useEffect(() => {
    if (!user || completedEventIds.length === 0) return;

    async function fetchAggregates() {
      const result: Record<string, VoteAggregate> = {};
      const votesRef = collection(db, 'parties', partyId, 'votes');
      const snap = await getDocs(votesRef);
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.aggregates && completedEventIds.includes(docSnap.id)) {
          result[docSnap.id] = data.aggregates;
        }
      });
      setAggregatesByEvent(result);
    }
    fetchAggregates();
  }, [partyId, user, completedEventIds]);

  return (
    <div className="bg-[var(--background)] px-4 pb-4 pt-6">
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Topplista</h1>
          {party && (
            <p className="text-sm text-[var(--foreground-muted)]">{party.name}</p>
          )}
        </div>

        <LeaderboardTable
          aggregatesByEvent={aggregatesByEvent}
          entriesByEvent={ENTRIES_BY_EVENT}
          completedEventIds={completedEventIds}
        />
      </div>
    </div>
  );
}

export default function LeaderboardPage({
  params,
}: {
  params: Promise<{ partyId: string }>;
}) {
  const { partyId } = use(params);

  return (
    <AuthGuard>
      <LeaderboardContent partyId={partyId} />
    </AuthGuard>
  );
}
