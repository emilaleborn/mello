'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useCurrentEvent } from '@/hooks/useCurrentEvent';
import { subscribeToUserParties } from '@/lib/firebase/parties';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PartyCard } from '@/components/party/PartyCard';
import { CreatePartyModal } from '@/components/party/CreatePartyModal';
import { JoinPartyForm } from '@/components/party/JoinPartyForm';
import type { Party } from '@/types';

function EventBanner() {
  const eventState = useCurrentEvent();

  if (!eventState) return null;

  const { event, status } = eventState;

  const statusConfig: Record<string, { label: string; bg: string; dot: string }> = {
    UPCOMING: { label: `Nästa: ${event.name}`, bg: 'bg-zinc-800', dot: 'bg-zinc-500' },
    TODAY_COUNTDOWN: { label: `${event.name} — Ikväll!`, bg: 'bg-amber-500/10', dot: 'bg-amber-400 animate-pulse' },
    VOTING_OPEN: { label: `${event.name} — LIVE`, bg: 'bg-emerald-500/10', dot: 'bg-emerald-400 animate-pulse' },
    VOTING_CLOSED: { label: `${event.name} — Stängd`, bg: 'bg-red-500/10', dot: 'bg-red-400' },
    RESULTS: { label: `${event.name} — Resultat`, bg: 'bg-violet-500/10', dot: 'bg-violet-400' },
    SEASON_COMPLETE: { label: 'Säsongen avslutad', bg: 'bg-zinc-800', dot: 'bg-zinc-500' },
  };

  const config = statusConfig[status] ?? statusConfig.UPCOMING;

  return (
    <Link href={`/event/${event.id}`}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl ${config.bg} p-4 active:opacity-80`}
      >
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
          <span className="text-sm font-bold text-white">{config.label}</span>
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          {event.date} &middot; {event.time} &middot; {event.city}, {event.arena}
        </p>
      </motion.div>
    </Link>
  );
}

function HomeContent() {
  const user = useAuthStore((s) => s.user);
  const [parties, setParties] = useState<Party[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserParties(user.uid, setParties);
    return () => unsub();
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <div className="mx-auto max-w-lg px-4 py-4">
        {/* Event banner */}
        <div className="mb-6">
          <EventBanner />
        </div>

        {/* Parties section */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-medium text-zinc-400">Mina sällskap</h2>

          {parties.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {parties.map((party) => (
                <PartyCard key={party.id} party={party} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl bg-zinc-900 p-6 text-center"
            >
              <p className="mb-1 text-base font-medium text-white">Välkommen till Mello!</p>
              <p className="text-sm text-zinc-400">
                Skapa eller gå med i ett sällskap för att börja rösta.
              </p>
            </motion.div>
          )}
        </div>

        {/* Quick actions */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setCreateOpen(true)}
            className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-bold text-white active:bg-violet-700"
          >
            Skapa sällskap
          </button>
          <button
            onClick={() => setShowJoin(!showJoin)}
            className="flex-1 rounded-xl bg-zinc-800 py-3 text-sm font-medium text-white active:bg-zinc-700"
          >
            Gå med i sällskap
          </button>
        </div>

        {/* Join form */}
        {showJoin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden rounded-2xl bg-zinc-900 p-4"
          >
            <h3 className="mb-3 text-sm font-medium text-zinc-300">Ange kod</h3>
            <JoinPartyForm />
          </motion.div>
        )}
      </div>

      <CreatePartyModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
