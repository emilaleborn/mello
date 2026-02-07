'use client';

import { useEffect, useState, useMemo, use } from 'react';
import { BarChart3 } from 'lucide-react';
import { doc, onSnapshot, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuthStore } from '@/stores/authStore';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { MELLO_EVENTS } from '@/constants/events';
import { ENTRIES_BY_EVENT } from '@/constants/entries';
import {
  calculateAgreementIndex,
  calculatePartyRankings,
} from '@/lib/utils/statistics';
import type { Party, VoteAggregate, UserVote } from '@/types';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

function StatsContent({ partyId }: { partyId: string }) {
  const user = useAuthStore((s) => s.user);
  const [party, setParty] = useState<Party | null>(null);
  const [aggregatesByEvent, setAggregatesByEvent] = useState<
    Record<string, VoteAggregate>
  >({});
  const [userVotesByEvent, setUserVotesByEvent] = useState<
    Record<string, Record<string, UserVote>>
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

    async function fetchData() {
      const aggResult: Record<string, VoteAggregate> = {};
      const votesResult: Record<string, Record<string, UserVote>> = {};

      for (const eventId of completedEventIds) {
        const eventDocRef = doc(db, 'parties', partyId, 'votes', eventId);
        const eventDocSnap = await getDocs(
          collection(db, 'parties', partyId, 'votes', eventId, 'userVotes'),
        );

        // Get aggregates
        const { getDoc } = await import('firebase/firestore');
        const aggSnap = await getDoc(eventDocRef);
        if (aggSnap.exists()) {
          const data = aggSnap.data();
          if (data.aggregates) {
            aggResult[eventId] = data.aggregates;
          }
        }

        // Get user votes
        const eventVotes: Record<string, UserVote> = {};
        eventDocSnap.forEach((docSnap) => {
          eventVotes[docSnap.id] = docSnap.data() as UserVote;
        });
        votesResult[eventId] = eventVotes;
      }

      setAggregatesByEvent(aggResult);
      setUserVotesByEvent(votesResult);
    }
    fetchData();
  }, [partyId, user, completedEventIds]);

  // Agreement data per entry across completed events
  const agreementData = useMemo(() => {
    const data: { name: string; agreement: number; artist: string }[] = [];

    for (const eventId of completedEventIds) {
      const entries = ENTRIES_BY_EVENT[eventId] || [];
      const votes = userVotesByEvent[eventId] || {};
      const voteValues = Object.values(votes);

      for (const entry of entries) {
        const ratings = voteValues
          .map((v) => v.ratings[entry.id])
          .filter((r): r is number => r != null);

        if (ratings.length > 0) {
          data.push({
            name: `${entry.artist.split(' ')[0]}`,
            artist: entry.artist,
            agreement: Math.round(calculateAgreementIndex(ratings)),
          });
        }
      }
    }

    return data.sort((a, b) => b.agreement - a.agreement);
  }, [completedEventIds, userVotesByEvent]);

  // Overall agreement
  const overallAgreement = useMemo(() => {
    if (agreementData.length === 0) return 0;
    const sum = agreementData.reduce((acc, d) => acc + d.agreement, 0);
    return Math.round(sum / agreementData.length);
  }, [agreementData]);

  // Combined rankings
  const allRanked = useMemo(() => {
    const all: ReturnType<typeof calculatePartyRankings> = [];
    for (const eventId of completedEventIds) {
      const entries = ENTRIES_BY_EVENT[eventId] || [];
      const agg = aggregatesByEvent[eventId] || {};
      all.push(...calculatePartyRankings(agg, entries));
    }
    all.sort((a, b) => b.avg - a.avg);
    all.forEach((item, idx) => {
      item.rank = idx + 1;
    });
    return all;
  }, [aggregatesByEvent, completedEventIds]);

  if (completedEventIds.length === 0) {
    return (
      <div className="min-h-dvh bg-[var(--background)] px-4 pb-20 pt-6">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-4 text-2xl font-bold text-white">Statistik</h1>
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-[var(--background-elevated)] py-10 text-center">
            <BarChart3 className="h-8 w-8 text-[var(--foreground-muted)]" />
            <p className="text-sm text-[var(--foreground-muted)]">
              Statistik visas efter första deltävlingen
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--background)] px-4 pb-20 pt-6">
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Statistik</h1>
          {party && <p className="text-sm text-[var(--foreground-muted)]">{party.name}</p>}
        </div>

        {/* Overall agreement */}
        <div className="rounded-2xl bg-[var(--background-elevated)] p-4 text-center">
          <p className="mb-1 text-sm text-[var(--foreground-muted)]">Sällskapets enighet</p>
          <p className="text-4xl font-bold text-[var(--mello-gold)]">
            {overallAgreement}%
          </p>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Hur överens ni är i snitt
          </p>
        </div>

        {/* Agreement chart */}
        {agreementData.length > 0 && (
          <div className="rounded-2xl bg-[var(--background-elevated)] p-4">
            <h2 className="mb-3 text-sm font-medium text-[var(--foreground)]">
              Enighetsindex per bidrag
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agreementData.slice(0, 12)}
                  layout="vertical"
                  margin={{ left: 0, right: 10, top: 0, bottom: 0 }}
                >
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={80}
                    tick={{ fill: '#9b8ec4', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#15122a',
                      border: 'none',
                      borderRadius: 12,
                      color: '#fff',
                      fontSize: 12,
                    }}
                    formatter={(value) => [`${value}%`, 'Enighet']}
                    labelFormatter={(label) => {
                      const item = agreementData.find((d) => d.name === String(label));
                      return item?.artist || String(label);
                    }}
                  />
                  <Bar dataKey="agreement" radius={[0, 6, 6, 0]}>
                    {agreementData.slice(0, 12).map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={idx === 0 ? '#f0b429' : '#9333ea'}
                        fillOpacity={1 - idx * 0.05}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Rankings */}
        <div className="rounded-2xl bg-[var(--background-elevated)] p-4">
          <h2 className="mb-3 text-sm font-medium text-[var(--foreground)]">
            Sammanlagd topplista
          </h2>
          <div className="space-y-2">
            {allRanked.slice(0, 10).map((entry) => (
              <div
                key={`${entry.eventId}-${entry.id}`}
                className="flex items-center gap-3"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    entry.rank === 1
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : entry.rank === 2
                        ? 'bg-zinc-400/20 text-zinc-300'
                        : entry.rank === 3
                          ? 'bg-orange-600/20 text-orange-400'
                          : 'bg-[var(--background-surface)] text-[var(--foreground-muted)]'
                  }`}
                >
                  {entry.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">{entry.artist}</p>
                  <p className="truncate text-xs text-[var(--foreground-muted)]">{entry.song}</p>
                </div>
                <span className="text-sm font-bold text-[var(--mello-gold)]">
                  {entry.avg.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatsPage({
  params,
}: {
  params: Promise<{ partyId: string }>;
}) {
  const { partyId } = use(params);

  return (
    <AuthGuard>
      <StatsContent partyId={partyId} />
    </AuthGuard>
  );
}
