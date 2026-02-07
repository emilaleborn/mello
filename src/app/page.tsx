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

  const statusConfig: Record<string, { label: string; bg: string; dot: string; className?: string }> = {
    UPCOMING: { label: `Nästa: ${event.name}`, bg: 'bg-[var(--background-surface)]', dot: 'bg-[var(--foreground-muted)]' },
    TODAY_COUNTDOWN: { label: `${event.name} — Ikväll!`, bg: 'bg-gradient-to-r from-amber-500/10 to-[var(--mello-gold)]/10', dot: 'bg-[var(--mello-gold)] animate-pulse', className: 'shimmer' },
    VOTING_OPEN: { label: `${event.name} — LIVE`, bg: 'bg-gradient-to-r from-[var(--mello-gold)]/15 to-[var(--mello-magenta)]/10', dot: 'bg-[var(--mello-gold)] animate-pulse' },
    VOTING_CLOSED: { label: `${event.name} — Stängd`, bg: 'bg-red-500/10', dot: 'bg-red-400' },
    RESULTS: { label: `${event.name} — Resultat`, bg: 'bg-[var(--mello-purple)]/10', dot: 'bg-[var(--mello-purple-light)]' },
    SEASON_COMPLETE: { label: 'Säsongen avslutad', bg: 'bg-[var(--background-surface)]', dot: 'bg-[var(--foreground-muted)]' },
  };

  const config = statusConfig[status] ?? statusConfig.UPCOMING;

  return (
    <Link href={`/event/${event.id}`}>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`spotlight rounded-2xl bg-gradient-to-r from-[var(--mello-purple)]/20 via-[var(--background-elevated)] to-[var(--mello-gold)]/10 border border-[var(--border)] p-4 active:opacity-80 ${config.className ?? ''}`}
      >
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
          <span className="font-display text-sm font-extrabold text-white">{config.label}</span>
        </div>
        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
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
    <div className="bg-[var(--background)] pb-4">
      <div className="mx-auto max-w-lg px-4 py-4">
        {/* Event banner */}
        <div className="mb-6">
          <EventBanner />
        </div>

        {/* Parties section */}
        <div className="mb-6">
          <h2 className="section-label mb-3 text-[var(--foreground-muted)]">Mina sällskap</h2>

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
              className="rounded-2xl bg-[var(--background-elevated)] p-6 text-center"
            >
              <p className="mb-1 text-base font-display font-bold text-white">Välkommen till Mello!</p>
              <p className="text-sm text-[var(--foreground-muted)]">
                Skapa eller gå med i ett sällskap för att börja rösta.
              </p>
            </motion.div>
          )}
        </div>

        {/* Quick actions */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setCreateOpen(true)}
            className="flex-1 rounded-xl bg-gradient-to-r from-[var(--mello-gold)] to-[var(--mello-magenta)] py-3 text-sm font-bold text-black active:opacity-90"
          >
            Skapa sällskap
          </button>
          <button
            onClick={() => setShowJoin(!showJoin)}
            className="flex-1 rounded-xl bg-[var(--background-surface)] py-3 text-sm font-medium text-[var(--foreground)] active:bg-[var(--background-surface)]/80"
          >
            Gå med i sällskap
          </button>
        </div>

        {/* Join form */}
        {showJoin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden rounded-2xl bg-[var(--background-elevated)] p-4"
          >
            <h3 className="section-label mb-3 text-[var(--foreground)]">Ange kod</h3>
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
