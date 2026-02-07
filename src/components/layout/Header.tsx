'use client';

import { useAuthStore } from '@/stores/authStore';
import { UserAvatar } from '@/components/auth/UserAvatar';
import Link from 'next/link';

export function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur-md">
      <Link href="/">
        <h1 className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-xl font-extrabold text-transparent">
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
