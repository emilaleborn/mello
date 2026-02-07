'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserAvatar } from '@/components/auth/UserAvatar';
import type { Party } from '@/types';

interface PartyCardProps {
  party: Party;
}

export function PartyCard({ party }: PartyCardProps) {
  const memberIds = party.members.slice(0, 5);
  const extraCount = party.members.length - 5;

  return (
    <Link href={`/party/${party.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-w-[200px] rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 active:opacity-90"
      >
        <h3 className="mb-2 truncate text-base font-bold text-white">{party.name}</h3>
        <div className="mb-2 flex -space-x-2">
          {memberIds.map((uid) => (
            <div key={uid} className="ring-2 ring-[var(--background-elevated)] rounded-full">
              <UserAvatar
                uid={uid}
                photoURL={party.memberPhotos[uid] ?? null}
                displayName={party.memberNames[uid] ?? '?'}
                size={28}
              />
            </div>
          ))}
          {extraCount > 0 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--background-surface)] text-xs font-medium text-[var(--foreground-muted)] ring-2 ring-[var(--background-elevated)]">
              +{extraCount}
            </div>
          )}
        </div>
        <p className="text-xs text-[var(--foreground-muted)]">
          {party.members.length} {party.members.length === 1 ? 'medlem' : 'medlemmar'}
        </p>
      </motion.div>
    </Link>
  );
}
