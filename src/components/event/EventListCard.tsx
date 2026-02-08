'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import type { MelloEvent, Entry } from '@/types';

type EventCardStatus = 'past' | 'current' | 'upcoming';

interface EventListCardProps {
  event: MelloEvent;
  entries: Entry[];
  status: EventCardStatus;
  index: number;
}

function EventBadge({ event }: { event: MelloEvent }) {
  if (event.type === 'final') {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--mello-gold)] to-[var(--mello-magenta)] font-display text-xs font-black text-black">
        F
      </span>
    );
  }
  if (event.type === 'finalkval') {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--mello-magenta)]/80 to-[var(--mello-purple)] font-display text-xs font-black text-white">
        FK
      </span>
    );
  }
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-surface)] font-display text-lg font-black text-[var(--foreground-muted)]">
      {event.number}
    </span>
  );
}

function StatusIndicator({ status }: { status: EventCardStatus }) {
  if (status === 'past') {
    return (
      <span className="section-label flex items-center gap-1.5 text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Avslutad
      </span>
    );
  }

  if (status === 'current') {
    return (
      <span className="section-label flex items-center gap-1.5 text-[var(--mello-gold)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--mello-gold)] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--mello-gold)]" />
        </span>
        Ikväll
      </span>
    );
  }

  return (
    <span className="section-label flex items-center gap-1.5 text-[var(--foreground-muted)]/60">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--foreground-muted)]/30" />
      Kommande
    </span>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('sv-SE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function EventListCard({ event, entries, status, index }: EventListCardProps) {
  const artistLine = entries.map((e) => e.artist).join(' \u00b7 ');
  const isCurrent = status === 'current';
  const isFinal = event.type === 'final';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        href={`/event/${event.id}`}
        className={`group relative block overflow-hidden rounded-2xl border transition-colors active:opacity-90 ${
          isCurrent
            ? 'border-[var(--mello-gold)]/25 bg-gradient-to-br from-[var(--mello-gold)]/8 via-[var(--background-elevated)] to-[var(--background-elevated)]'
            : isFinal
              ? 'border-[var(--mello-magenta)]/15 bg-gradient-to-br from-[var(--mello-magenta)]/5 via-[var(--background-elevated)] to-[var(--background-elevated)]'
              : 'border-[var(--border)] bg-[var(--background-elevated)]'
        }`}
      >
        {/* Spotlight glow for current event */}
        {isCurrent && (
          <div className="absolute -top-12 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full bg-[var(--mello-gold)]/8 blur-2xl" />
        )}

        <div className="relative p-4">
          <div className="flex items-start gap-3">
            <EventBadge event={event} />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-extrabold tracking-tight text-white">
                  {event.name}
                </h3>
                <StatusIndicator status={status} />
              </div>

              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                <span>{formatDate(event.date)} &middot; {event.time}</span>
                <span className="text-[var(--foreground-muted)]/30">|</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {event.city}
                </span>
              </div>
            </div>

            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[var(--foreground-muted)]/40 transition-transform group-active:translate-x-0.5" />
          </div>

          {entries.length > 0 && (
            <div className="mt-3 border-t border-[var(--border)]/50 pt-3">
              <p className="truncate text-xs text-[var(--foreground-muted)]/60">
                {artistLine}
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
