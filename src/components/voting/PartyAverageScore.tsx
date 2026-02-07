'use client';

interface PartyAverageScoreProps {
  avg: number;
  count: number;
}

export function PartyAverageScore({ avg, count }: PartyAverageScoreProps) {
  if (count === 0) return null;

  return (
    <div className="flex items-baseline gap-1.5">
      <span className="score-display text-lg text-[var(--mello-gold)]">{avg.toFixed(1)}</span>
      <span className="text-xs text-[var(--foreground-muted)]">({count} {count === 1 ? 'röst' : 'röster'})</span>
    </div>
  );
}
