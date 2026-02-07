'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { subscribeToParty } from '@/lib/firebase/parties';
import { subscribeToAggregates } from '@/lib/firebase/votes';
import { useCurrentEvent } from '@/hooks/useCurrentEvent';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PartyMemberList } from '@/components/party/PartyMemberList';
import { SharePartySheet } from '@/components/party/SharePartySheet';
import type { Party, EventVotes } from '@/types';

function PartyDetailContent() {
  const params = useParams();
  const partyId = params.partyId as string;
  const [party, setParty] = useState<Party | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [aggregates, setAggregates] = useState<EventVotes | null>(null);
  const currentEvent = useCurrentEvent();

  useEffect(() => {
    const unsub = subscribeToParty(partyId, setParty);
    return () => unsub();
  }, [partyId]);

  useEffect(() => {
    if (!currentEvent) return;
    const unsub = subscribeToAggregates(partyId, currentEvent.event.id, setAggregates);
    return () => unsub();
  }, [partyId, currentEvent]);

  if (!party) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <div className="border-b border-zinc-800 px-4 py-4">
        <h1 className="text-xl font-bold text-white">{party.name}</h1>
        <p className="text-sm text-zinc-400">
          {party.members.length} {party.members.length === 1 ? 'medlem' : 'medlemmar'}
        </p>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4">
        <button
          onClick={() => setShareOpen(true)}
          className="mb-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white active:bg-violet-700"
        >
          Bjud in medlemmar
        </button>

        {currentEvent && (
          <div className="mb-4">
            <h2 className="mb-2 text-sm font-medium text-zinc-400">
              {currentEvent.event.name} — Röstningsstatus
            </h2>
          </div>
        )}

        <PartyMemberList party={party} aggregates={aggregates} />
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

export default function PartyDetailPage() {
  return (
    <AuthGuard>
      <PartyDetailContent />
    </AuthGuard>
  );
}
