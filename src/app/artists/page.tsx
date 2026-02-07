'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { MELLO_EVENTS } from '@/constants/events';
import { ENTRIES_BY_EVENT } from '@/constants/entries';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ArtistImage } from '@/components/ui/ArtistImage';
import type { Entry } from '@/types';

function ArtistListItem({ entry, index }: { entry: Entry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        href={`/artist/${entry.id}`}
        className="flex items-center gap-3 rounded-2xl bg-[var(--background-elevated)] p-3 transition-colors active:bg-[var(--background-surface)]"
      >
        <div className="relative shrink-0">
          <ArtistImage entryId={entry.id} artistName={entry.artist} size={44} />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--mello-gold)] text-[10px] font-bold text-black">
            {entry.startNumber}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white">{entry.artist}</p>
          <p className="truncate text-sm text-[var(--foreground-muted)]">{entry.song}</p>
        </div>
        <svg
          className="h-4 w-4 shrink-0 text-[var(--foreground-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </motion.div>
  );
}

function ArtistsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const isSearching = searchQuery.trim().length > 0;

  const allEntries = Object.values(ENTRIES_BY_EVENT).flat();
  const filteredEntries = isSearching
    ? allEntries.filter(
        (entry) =>
          entry.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.song.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  return (
    <div className="bg-[var(--background)] pb-4">
      <div className="border-b border-[var(--border)] px-4 py-4">
        <h1 className="text-xl font-bold text-white">Artister</h1>
        <p className="text-sm text-[var(--foreground-muted)]">
          Melodifestivalen 2026
        </p>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4">
        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Sök artist eller låt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-[var(--background-surface)] py-3 pl-10 pr-4 text-white placeholder-[var(--foreground-muted)] outline-none"
          />
        </div>

        {isSearching ? (
          /* Flat filtered list */
          <div className="space-y-2">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry, i) => (
                <ArtistListItem key={entry.id} entry={entry} index={i} />
              ))
            ) : (
              <div className="rounded-2xl bg-[var(--background-elevated)] py-10 text-center">
                <p className="text-sm text-[var(--foreground-muted)]">
                  Inga resultat för &ldquo;{searchQuery}&rdquo;
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Grouped by event */
          <div className="space-y-6">
            {MELLO_EVENTS.filter((event) => ENTRIES_BY_EVENT[event.id]).map((event) => {
              const entries = ENTRIES_BY_EVENT[event.id];
              return (
                <div key={event.id}>
                  <h2 className="mb-2 text-sm font-semibold text-[var(--foreground-muted)]">
                    {event.name}
                  </h2>
                  <div className="space-y-2">
                    {entries.map((entry, i) => (
                      <ArtistListItem key={entry.id} entry={entry} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArtistsPage() {
  return (
    <AuthGuard>
      <ArtistsContent />
    </AuthGuard>
  );
}
