'use client';

import { useAuthStore } from '@/stores/authStore';
import { UserAvatar } from '@/components/auth/UserAvatar';
import Link from 'next/link';

export function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/95 px-4 py-3 shadow-[0_1px_12px_-4px_rgba(147,51,234,0.3)] backdrop-blur-md">
      <Link href="/" className="flex items-center gap-1.5">
        <h1 className="bg-gradient-to-r from-[var(--mello-gold)] via-[var(--mello-magenta)] to-[var(--mello-purple)] bg-clip-text font-display text-xl font-extrabold text-transparent">
          Mello
        </h1>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[var(--mello-gold)]"
        >
          <path
            d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z"
            fill="currentColor"
          />
        </svg>
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
