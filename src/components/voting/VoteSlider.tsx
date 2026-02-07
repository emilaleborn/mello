'use client';

interface VoteSliderProps {
  value: number | undefined;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function VoteSlider({ value, onChange, disabled }: VoteSliderProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => !disabled && onChange(n)}
          disabled={disabled}
          className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
            value === n
              ? n >= 8
                ? 'bg-gradient-to-br from-[var(--mello-magenta)] to-[var(--mello-gold)] text-black shadow-lg shadow-[var(--mello-gold)]/30'
                : 'bg-gradient-to-br from-[var(--mello-gold)] to-[var(--mello-gold-light)] text-black shadow-lg shadow-[var(--mello-gold)]/30'
              : value !== undefined && n <= value
                ? 'bg-[var(--mello-gold)]/20 text-[var(--mello-gold-light)]'
                : 'bg-[var(--background-surface)] text-[var(--foreground-muted)] hover:bg-[var(--background-surface)]/80'
          } ${disabled ? 'opacity-50' : 'active:scale-95'}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
