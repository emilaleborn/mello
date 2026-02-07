'use client';

import { useParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ArtistDetailContent } from '@/components/artist/ArtistDetailContent';

function ArtistPageContent() {
  const params = useParams();
  const entryId = params.entryId as string;

  return <ArtistDetailContent entryId={entryId} />;
}

export default function ArtistPage() {
  return (
    <AuthGuard>
      <ArtistPageContent />
    </AuthGuard>
  );
}
