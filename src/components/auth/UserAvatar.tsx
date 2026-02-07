'use client';

import Image from 'next/image';
import { User } from 'lucide-react';

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

interface UserAvatarProps {
  uid: string;
  photoURL: string | null;
  displayName: string;
  size?: number;
}

export function UserAvatar({ uid, photoURL, displayName, size = 40 }: UserAvatarProps) {
  if (photoURL) {
    return (
      <Image
        src={photoURL}
        alt={displayName}
        width={size}
        height={size}
        className="rounded-full"
        referrerPolicy="no-referrer"
      />
    );
  }

  const initials = displayName ? initialsFor(displayName) : null;

  return (
    <div
      className="flex items-center justify-center rounded-full bg-[var(--mello-purple)] text-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials || <User style={{ width: size * 0.5, height: size * 0.5 }} />}
    </div>
  );
}
