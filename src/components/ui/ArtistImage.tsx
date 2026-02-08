'use client';

import { useState } from 'react';
import { Music } from 'lucide-react';

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

interface ArtistImageProps {
  entryId: string;
  artistName: string;
  size?: number;
}

export function ArtistImage({ entryId, artistName, size = 48 }: ArtistImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    const initials = artistName ? initialsFor(artistName) : null;

    return (
      <div
        className="flex items-center justify-center rounded-xl bg-[var(--mello-purple)]/20 text-[var(--mello-purple-light)]"
        style={{ width: size, height: size, fontSize: size * 0.35 }}
      >
        {initials || <Music style={{ width: size * 0.5, height: size * 0.5 }} />}
      </div>
    );
  }

  return (
    <img
      src={`/artists/${entryId}.jpg`}
      alt={artistName}
      width={size}
      height={size}
      className="rounded-xl object-cover"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
