'use client';

import { useAuthStore } from '@/stores/authStore';
import { UserAvatar } from '@/components/auth/UserAvatar';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="shrink-0 z-40 flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/95 px-4 py-3 shadow-[0_1px_12px_-4px_rgba(147,51,234,0.3)] backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/icons/icon-512.png"
          alt="Mello"
          width={32}
          height={32}
          className="rounded-full"
        />
        <h1 className="bg-gradient-to-r from-[var(--mello-gold)] via-[var(--mello-magenta)] to-[var(--mello-purple)] bg-clip-text font-display text-xl font-extrabold text-transparent">
          Mello
        </h1>
      </Link>
      {user && (
        <Link href="/profile">
          <UserAvatar
            uid={user.uid}
            photoURL={user.photoURL}
            displayName={user.displayName}
            size={32}
          />
        </Link>
      )}
    </header>
  );
}
