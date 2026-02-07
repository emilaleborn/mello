'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { MELLO_EVENTS } from '@/constants/events';
import { ENTRIES_BY_EVENT } from '@/constants/entries';
import { useCurrentEvent } from '@/hooks/useCurrentEvent';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { EventListCard } from '@/components/event/EventListCard';

type CardStatus = 'past' | 'current' | 'upcoming';

function getEventStatus(eventId: string, currentEventId: string | null): CardStatus {
  if (!currentEventId) return 'upcoming';

  const eventIdx = MELLO_EVENTS.findIndex((e) => e.id === eventId);
  const currentIdx = MELLO_EVENTS.findIndex((e) => e.id === currentEventId);

  if (eventIdx < currentIdx) return 'past';
  if (eventId === currentEventId) return 'current';
  return 'upcoming';
}

function EventsListContent() {
  const currentEventState = useCurrentEvent();
  const currentEventId = currentEventState?.event.id ?? null;
  const currentStatus = currentEventState?.status;

  // If the current event has status RESULTS or SEASON_COMPLETE, it's past too
  const isPastStatus =
    currentStatus === 'RESULTS' || currentStatus === 'SEASON_COMPLETE';

  return (
    <div className="bg-[var(--background)] pb-4">
      <div className="border-b border-[var(--border)] px-4 py-4">
        <h1 className="text-xl font-bold text-white">Tävlingar</h1>
        <p className="text-sm text-[var(--foreground-muted)]">
          Melodifestivalen 2026
        </p>
      </div>

      <div className="mx-auto max-w-lg space-y-3 px-4 py-4">
        {MELLO_EVENTS.map((event, i) => {
          let status = getEventStatus(event.id, currentEventId);
          // If the current event is in RESULTS/SEASON_COMPLETE, mark it as past
          if (status === 'current' && isPastStatus && event.id === currentEventId) {
            status = 'past';
          }
          const entries = ENTRIES_BY_EVENT[event.id] ?? [];

          return (
            <EventListCard
              key={event.id}
              event={event}
              entries={entries}
              status={status}
              index={i}
            />
          );
        })}

        {/* All artists link */}
        <Link
          href="/artists"
          className="flex items-center gap-3 rounded-2xl bg-[var(--background-elevated)] p-4 transition-colors active:bg-[var(--background-surface)]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--mello-purple)]/20">
            <Users className="h-5 w-5 text-[var(--mello-purple-light)]" />
          </div>
          <div>
            <p className="font-medium text-white">Alla artister</p>
            <p className="text-sm text-[var(--foreground-muted)]">Bläddra bland alla 30 bidrag</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <AuthGuard>
      <EventsListContent />
    </AuthGuard>
  );
}
