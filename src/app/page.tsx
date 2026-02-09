'use client';

import { useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
  UserPlus,
  Users,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useCurrentEvent } from '@/hooks/useCurrentEvent';
import { subscribeToUserParties } from '@/lib/firebase/parties';
import { parseEventDateTime } from '@/lib/utils/eventLogic';
import { MELLO_EVENTS } from '@/constants/events';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PartyCard } from '@/components/party/PartyCard';
import { CreatePartyModal } from '@/components/party/CreatePartyModal';
import { JoinPartyForm } from '@/components/party/JoinPartyForm';
import type { Party, EventStatus } from '@/types';

const ease = [0.22, 1, 0.36, 1] as const;

// --- Sub-components ---

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-baseline gap-1">
      <span className="score-display text-3xl text-[var(--mello-gold)]">
        {timeLeft.hours.toString().padStart(2, '0')}
      </span>
      <span className="text-sm text-[var(--foreground-muted)]">t</span>
      <span className="score-display text-3xl text-[var(--mello-gold)]">
        {timeLeft.minutes.toString().padStart(2, '0')}
      </span>
      <span className="text-sm text-[var(--foreground-muted)]">m</span>
      <span className="score-display text-3xl text-[var(--mello-gold)]">
        {timeLeft.seconds.toString().padStart(2, '0')}
      </span>
      <span className="text-sm text-[var(--foreground-muted)]">s</span>
    </div>
  );
}

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

function LivePulse() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--mello-gold)] opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--mello-gold)]" />
      </span>
      <span className="text-sm font-semibold text-[var(--mello-gold)]">
        Röstningen är öppen
      </span>
    </div>
  );
}

// --- Hero status configs ---

interface HeroConfig {
  bg: string;
  border: string;
  badgeLabel: string;
  badgeClass: string;
  ping?: boolean;
  className?: string;
}

const heroConfigs: Record<EventStatus, HeroConfig> = {
  UPCOMING: {
    bg: 'bg-[var(--background-elevated)]',
    border: 'border-[var(--border)]',
    badgeLabel: 'KOMMANDE',
    badgeClass: 'bg-[var(--background-surface)] text-[var(--foreground-muted)]',
  },
  TODAY_COUNTDOWN: {
    bg: 'bg-gradient-to-br from-[var(--mello-gold)]/15 via-[var(--background-elevated)] to-[var(--mello-magenta)]/10',
    border: 'border-[var(--mello-gold)]/20',
    badgeLabel: 'IKVÄLL',
    badgeClass: 'bg-[var(--mello-gold)]/15 text-[var(--mello-gold)]',
    ping: true,
    className: 'shimmer',
  },
  VOTING_OPEN: {
    bg: 'bg-gradient-to-br from-[var(--mello-gold)]/20 via-[var(--background-elevated)] to-[var(--mello-magenta)]/15',
    border: 'border-[var(--mello-gold)]/30',
    badgeLabel: 'LIVE',
    badgeClass: 'bg-[var(--mello-gold)]/20 text-[var(--mello-gold)]',
    className: 'shimmer',
  },
  VOTING_CLOSED: {
    bg: 'bg-gradient-to-br from-red-500/12 via-[var(--background-elevated)] to-red-500/5',
    border: 'border-red-500/15',
    badgeLabel: 'STÄNGD',
    badgeClass: 'bg-red-500/15 text-red-400',
  },
  RESULTS: {
    bg: 'bg-gradient-to-br from-[var(--mello-purple)]/15 via-[var(--background-elevated)] to-[var(--mello-gold)]/10',
    border: 'border-[var(--mello-purple)]/20',
    badgeLabel: 'RESULTAT',
    badgeClass: 'bg-[var(--mello-purple)]/15 text-[var(--mello-purple-light)]',
    className: 'celebrate',
  },
  SEASON_COMPLETE: {
    bg: 'bg-[var(--background-elevated)]',
    border: 'border-[var(--border)]',
    badgeLabel: 'AVSLUTAD',
    badgeClass: 'bg-[var(--background-surface)] text-[var(--foreground-muted)]',
  },
};

function HeroEvent() {
  const eventState = useCurrentEvent();

  if (!eventState) return null;

  const { event, status } = eventState;
  const config = heroConfigs[status];
  const showStart = parseEventDateTime(event);

  return (
    <Link href={`/event/${event.id}`}>
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease }}
        className={`spotlight relative overflow-hidden rounded-2xl ${config.bg} border ${config.border} p-5 active:opacity-90 ${config.className ?? ''}`}
      >
        {/* Top glow decoration */}
        <div className="pointer-events-none absolute -top-12 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full bg-[var(--mello-gold)]/8 blur-2xl" />

        <div className="relative z-[1]">
          {/* Badge */}
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${config.badgeClass}`}
            >
              {config.ping && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--mello-gold)] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--mello-gold)]" />
                </span>
              )}
              {config.badgeLabel}
            </span>
          </div>

          {/* Event name */}
          <h1 className="font-display text-2xl font-black text-white">
            {event.name}
          </h1>

          {/* Meta line */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--foreground-muted)]">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatSwedishDate(event.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {event.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {event.city}, {event.arena}
            </span>
          </div>

          {/* Status-specific content */}
          {status === 'TODAY_COUNTDOWN' && (
            <div className="mt-4">
              <p className="mb-1 text-xs text-[var(--foreground-muted)]">
                Sändningen börjar om
              </p>
              <CountdownTimer targetDate={showStart} />
            </div>
          )}

          {status === 'VOTING_OPEN' && (
            <div className="mt-4">
              <LivePulse />
            </div>
          )}
        </div>

        {/* Chevron */}
        <ChevronRight className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--foreground-muted)]/40" />
      </motion.div>
    </Link>
  );
}

// --- Season Progress ---

function SeasonProgress() {
  const eventState = useCurrentEvent();
  if (!eventState) return null;

  const currentIndex = MELLO_EVENTS.findIndex(
    (e) => e.id === eventState.event.id,
  );

  const labels: Record<string, string> = {
    dt1: '1',
    dt2: '2',
    dt3: '3',
    dt4: '4',
    dt5: '5',
    finalkval: 'FK',
    final: 'F',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease }}
      className="flex items-center gap-0"
    >
      {MELLO_EVENTS.map((ev, i) => {
        const isPast = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <Fragment key={ev.id}>
            {i > 0 && <SeasonConnector filled={i <= currentIndex} />}
            <SeasonNode
              label={labels[ev.id] ?? ev.id}
              isPast={isPast}
              isCurrent={isCurrent}
              index={i}
            />
          </Fragment>
        );
      })}
    </motion.div>
  );
}

function SeasonNode({
  label,
  isPast,
  isCurrent,
  index,
}: {
  label: string;
  isPast: boolean;
  isCurrent: boolean;
  index: number;
}) {
  let nodeClass =
    'bg-[var(--background-surface)] text-[var(--foreground-muted)]';
  if (isPast) {
    nodeClass = 'bg-[var(--mello-gold)]/15 text-[var(--mello-gold)]';
  }
  if (isCurrent) {
    nodeClass =
      'bg-gradient-to-br from-[var(--mello-gold)] to-[var(--mello-magenta)] text-black shadow-[0_0_12px_rgba(240,180,41,0.4)]';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.2 + index * 0.04, ease }}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${nodeClass}`}
    >
      {label}
    </motion.div>
  );
}

function SeasonConnector({ filled }: { filled: boolean }) {
  return (
    <div
      className={`h-0.5 flex-1 ${filled ? 'bg-[var(--mello-gold)]/40' : 'bg-[var(--border)]'}`}
    />
  );
}

// --- Home Content ---

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

  const hasParties = parties.length > 0;

  return (
    <div className="bg-[var(--background)] pb-4">
      <div className="mx-auto max-w-lg px-4 py-4">
        {/* Hero Event */}
        <div className="mb-5">
          <HeroEvent />
        </div>

        {/* Season Progress */}
        <div className="mb-6 px-2">
          <SeasonProgress />
        </div>

        {/* Parties section */}
        {hasParties ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            className="mb-6"
          >
            <div className="mb-3 flex items-center gap-2">
              <h2 className="section-label text-[var(--foreground-muted)]">
                Mina sällskap
              </h2>
              <span className="inline-flex h-5 min-h-0 min-w-5 items-center justify-center rounded-full bg-[var(--mello-gold)]/15 px-1.5 text-[10px] font-bold text-[var(--mello-gold)]">
                {parties.length}
              </span>
            </div>

            <div className="relative">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {parties.map((party, i) => (
                  <motion.div
                    key={party.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + i * 0.06,
                      ease,
                    }}
                  >
                    <PartyCard party={party} />
                  </motion.div>
                ))}
              </div>
              {/* Scroll fade hint */}
              {parties.length > 1 && (
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[var(--background)] to-transparent" />
              )}
            </div>
          </motion.div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            className="spotlight mb-6 rounded-2xl bg-[var(--background-elevated)] border border-[var(--border)] p-6 text-center"
          >
            <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--mello-gold)]/20 to-[var(--mello-magenta)]/10">
              <Users className="h-7 w-7 text-[var(--mello-gold)]" />
              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-[var(--mello-gold-light)]" />
            </div>
            <h3 className="mb-1 font-display text-lg font-bold text-white">
              Er soffa, er jury
            </h3>
            <p className="mb-5 text-sm text-[var(--foreground-muted)]">
              Skapa ett sällskap och bjud in vänner för att rösta och jämföra
              betyg i realtid.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCreateOpen(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--mello-gold)] to-[var(--mello-magenta)] py-3 text-sm font-bold text-black active:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Skapa
              </button>
              <button
                onClick={() => setShowJoin(!showJoin)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--background-surface)] border border-[var(--border)] py-3 text-sm font-medium text-[var(--foreground)] active:opacity-90"
              >
                <UserPlus className="h-4 w-4" />
                Gå med
              </button>
            </div>

            {/* Inline join form in empty state */}
            <AnimatePresence>
              {showJoin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <JoinPartyForm />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Quick actions (only shown when parties exist) */}
        {hasParties && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease }}
            className="space-y-3"
          >
            {/* Create party */}
            <button
              onClick={() => setCreateOpen(true)}
              className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-[var(--mello-gold)]/15 to-[var(--mello-magenta)]/10 border border-[var(--mello-gold)]/15 p-4 text-left active:opacity-90"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--mello-gold)] to-[var(--mello-magenta)]">
                <Plus className="h-5 w-5 text-black" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Skapa sällskap</p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Starta en grupp och bjud in vänner
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-[var(--foreground-muted)]/40" />
            </button>

            {/* Join party */}
            <div>
              <button
                onClick={() => setShowJoin(!showJoin)}
                className="flex w-full items-center gap-3 rounded-2xl bg-[var(--background-elevated)] border border-[var(--border)] p-4 text-left active:opacity-90"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--background-surface)]">
                  <UserPlus className="h-5 w-5 text-[var(--foreground-muted)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">
                    Gå med i sällskap
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    Ange en 6-siffrig kod
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: showJoin ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-5 w-5 text-[var(--foreground-muted)]/40" />
                </motion.div>
              </button>

              {/* Expandable join form */}
              <AnimatePresence>
                {showJoin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-b-2xl bg-[var(--background-elevated)] border border-t-0 border-[var(--border)] p-4">
                      <JoinPartyForm />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      <CreatePartyModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

// --- Helpers ---

function formatSwedishDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'maj',
    'jun',
    'jul',
    'aug',
    'sep',
    'okt',
    'nov',
    'dec',
  ];
  return `${day} ${months[month - 1]} ${year}`;
}

// --- Page ---

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
