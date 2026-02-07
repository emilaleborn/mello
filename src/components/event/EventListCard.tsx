'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import type { MelloEvent, Entry } from '@/types';

type EventCardStatus = 'past' | 'current' | 'upcoming';

interface EventListCardProps {
  event: MelloEvent;
  entries: Entry[];
  status: EventCardStatus;
  index: number;
}

function StatusDot({ status }: { status: EventCardStatus }) {
  if (status === 'past') {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Avslutad
      </span>
    );
  }

  if (status === 'current') {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--mello-gold)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--mello-gold)] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--mello-gold)]" />
        </span>
        Ikväll
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--foreground-muted)]">
      <span className="h-2 w-2 rounded-full bg-[var(--foreground-muted)]/40" />
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
  const artistLine = entries.map((e) => e.artist).join(', ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        href={`/event/${event.id}`}
        className={`block rounded-2xl bg-[var(--background-elevated)] p-4 transition-colors active:bg-[var(--background-surface)] ${
          status === 'current' ? 'ring-1 ring-[var(--mello-gold)]/30' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-extrabold tracking-tight text-white">{event.name}</h3>
          <StatusDot status={status} />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--foreground-muted)]">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(event.date)} &middot; {event.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {event.arena}, {event.city}
          </span>
        </div>

        {entries.length > 0 && (
          <p className="mt-3 truncate text-sm text-[var(--foreground-muted)]/70">
            {artistLine}
          </p>
        )}
      </Link>
    </motion.div>
  );
}
