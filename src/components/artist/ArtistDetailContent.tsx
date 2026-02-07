'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { ChevronLeft, Mic2, Calendar, MapPin, Heart } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { MELLO_EVENTS } from '@/constants/events';
import { ALL_ENTRIES } from '@/constants/entries';
import { useAuthStore } from '@/stores/authStore';
import { usePartyStore } from '@/stores/partyStore';
import { subscribeToUserParties } from '@/lib/firebase/parties';
import { subscribeToAggregates } from '@/lib/firebase/votes';
import { ArtistImage } from '@/components/ui/ArtistImage';
import type { EventVotes, UserVote } from '@/types';

interface ArtistDetailContentProps {
  entryId: string;
}

export function ArtistDetailContent({ entryId }: ArtistDetailContentProps) {
  const entry = ALL_ENTRIES.find((e) => e.id === entryId);
  const event = entry ? MELLO_EVENTS.find((e) => e.id === entry.eventId) : undefined;

  const user = useAuthStore((s) => s.user);
  const { parties, setParties } = usePartyStore();
  const [manualPartyId, setManualPartyId] = useState<string | null>(null);
  const [partyAggregates, setPartyAggregates] = useState<EventVotes | null>(null);
  const [partyUserVotes, setPartyUserVotes] = useState<Record<string, UserVote>>({});

  // Subscribe to parties
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserParties(user.uid, setParties);
    return () => unsub();
  }, [user, setParties]);

  // Derive selected party: use manual selection, or fall back to first party
  const selectedPartyId = manualPartyId ?? (parties.length > 0 ? parties[0].id : null);
  const selectedParty = parties.find((p) => p.id === selectedPartyId) ?? null;

  // Subscribe to aggregates for this entry's event
  useEffect(() => {
    if (!selectedPartyId || !entry) return;
    const unsub = subscribeToAggregates(selectedPartyId, entry.eventId, setPartyAggregates);
    return () => unsub();
  }, [selectedPartyId, entry]);

  // Fetch individual user votes
  useEffect(() => {
    if (!selectedPartyId || !entry) return;
    if (!partyAggregates?.voterIds?.length) return;
    async function fetchUserVotes() {
      const snap = await getDocs(
        collection(db, 'parties', selectedPartyId!, 'votes', entry!.eventId, 'userVotes'),
      );
      const votes: Record<string, UserVote> = {};
      snap.forEach((d) => {
        votes[d.id] = d.data() as UserVote;
      });
      setPartyUserVotes(votes);
    }
    fetchUserVotes();
  }, [selectedPartyId, entry, partyAggregates?.voterIds?.length]);

  if (!entry || !event) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--foreground-muted)]">Artisten hittades inte.</p>
      </div>
    );
  }

  const entryAgg = partyAggregates?.aggregates?.[entry.id];
  const favoriteCounts: Record<string, number> = {};
  if (Object.keys(partyUserVotes).length > 0) {
    Object.values(partyUserVotes).forEach((vote) => {
      if (vote.favorite === entry.id) {
        favoriteCounts[entry.id] = (favoriteCounts[entry.id] || 0) + 1;
      }
    });
  }

  const eventDate = new Date(event.date + 'T12:00:00');
  const formattedDate = eventDate.toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="bg-[var(--background)] pb-4">
      {/* Back link */}
      <div className="px-4 pt-4">
        <Link
          href={`/event/${entry.eventId}`}
          className="inline-flex items-center gap-1 text-sm text-[var(--foreground-muted)] active:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          {event.name}
        </Link>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center px-4 pb-6 pt-4"
      >
        <div className="relative mb-4 rounded-2xl bg-gradient-to-b from-[var(--mello-purple)]/30 to-transparent p-4">
          <ArtistImage entryId={entry.id} artistName={entry.artist} size={160} />
          <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--mello-gold)] text-sm font-bold text-black">
            {entry.startNumber}
          </span>
        </div>

        <h1 className="font-display text-2xl font-black tracking-tight text-white">{entry.artist}</h1>
        <p className="font-display text-lg font-bold text-[var(--mello-gold)]">{entry.song}</p>
        <span className="mt-1 text-sm text-[var(--foreground-muted)]">
          {event.name} &middot; Startnr {entry.startNumber}
        </span>
      </motion.div>

      <div className="mx-auto max-w-lg space-y-3 px-4">
        {/* Bio card */}
        {entry.bio && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl bg-[var(--background-elevated)] p-4"
          >
            <h2 className="section-label mb-2 text-[var(--foreground-muted)]">Om artisten</h2>
            <p className="text-[var(--foreground)]">{entry.bio}</p>
          </motion.div>
        )}

        {/* Songwriters card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-[var(--background-elevated)] p-4"
        >
          <div className="mb-2 flex items-center gap-2">
            <Mic2 className="h-4 w-4 text-[var(--foreground-muted)]" />
            <h2 className="section-label text-[var(--foreground-muted)]">Låtskrivare</h2>
          </div>
          <p className="text-[var(--foreground)]">{entry.songwriters.join(', ')}</p>
        </motion.div>

        {/* Event link card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link
            href={`/event/${entry.eventId}`}
            className="flex items-center gap-3 rounded-2xl bg-[var(--background-elevated)] p-4 transition-colors active:bg-[var(--background-surface)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--mello-purple)]/20">
              <Calendar className="h-5 w-5 text-[var(--mello-purple-light)]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">{event.name}</p>
              <p className="text-sm text-[var(--foreground-muted)]">
                {formattedDate} &middot; {event.time}
              </p>
              <p className="flex items-center gap-1 text-sm text-[var(--foreground-muted)]">
                <MapPin className="h-3 w-3" />
                {event.arena}, {event.city}
              </p>
            </div>
            <ChevronLeft className="h-4 w-4 rotate-180 text-[var(--foreground-muted)]" />
          </Link>
        </motion.div>

        {/* Party voting section */}
        {parties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold tracking-tight text-white">Sällskapets betyg</h2>
            </div>

            {/* Party selector */}
            {parties.length > 1 && (
              <select
                value={selectedPartyId ?? ''}
                onChange={(e) => setManualPartyId(e.target.value)}
                className="mb-3 w-full rounded-xl bg-[var(--background-surface)] px-4 py-3 text-white outline-none"
              >
                {parties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}

            {entryAgg && entryAgg.count > 0 ? (
              <div className="rounded-2xl bg-[var(--background-elevated)] p-4">
                {/* Average score */}
                <div className="mb-4 flex items-center gap-4">
                  <span className="score-display text-4xl text-[var(--mello-gold)] text-glow-gold">
                    {entryAgg.avg.toFixed(1)}
                  </span>
                  <div>
                    <p className="text-sm text-[var(--foreground)]">Snittbetyg</p>
                    <p className="text-xs text-[var(--foreground-muted)]">
                      {entryAgg.count} röst{entryAgg.count !== 1 ? 'er' : ''}
                      {(favoriteCounts[entry.id] || 0) > 0 && (
                        <span className="ml-2 inline-flex items-center gap-1 text-[var(--mello-magenta)]">
                          <Heart className="h-3 w-3 fill-current" />
                          {favoriteCounts[entry.id]}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Per-member ratings */}
                {selectedParty && Object.keys(partyUserVotes).length > 0 && (
                  <div className="space-y-1 border-t border-[var(--border)] pt-3">
                    {Object.entries(partyUserVotes).map(([userId, vote]) => {
                      const rating = vote.ratings[entry.id];
                      const isFav = vote.favorite === entry.id;
                      const memberName = selectedParty.memberNames[userId] || 'Okänd';

                      return (
                        <div key={userId} className="flex items-center justify-between py-1">
                          <span className="text-sm text-[var(--foreground)]">
                            {memberName}
                            {isFav && (
                              <Heart className="ml-1 inline h-3 w-3 fill-current text-[var(--mello-magenta)]" />
                            )}
                          </span>
                          <span className="text-sm font-medium text-[var(--mello-gold)]">
                            {rating != null ? rating : '-'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-[var(--background-elevated)] p-4 text-center">
                <p className="text-sm text-[var(--foreground-muted)]">
                  Ingen i sällskapet har betygsatt denna låt ännu
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
