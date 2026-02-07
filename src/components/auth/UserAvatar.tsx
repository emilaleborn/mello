'use client';

import Image from 'next/image';

const ANON_EMOJIS = ['🎵', '🎤', '🎶', '🎸', '🥁', '🎹', '🎷', '🎺', '🪗', '🎻'];

function emojiForUid(uid: string): string {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = (hash * 31 + uid.charCodeAt(i)) | 0;
  }
  return ANON_EMOJIS[Math.abs(hash) % ANON_EMOJIS.length];
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

  return (
    <div
      className="flex items-center justify-center rounded-full bg-[var(--mello-purple)] text-white"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {emojiForUid(uid)}
    </div>
  );
}
