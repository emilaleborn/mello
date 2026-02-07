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
              ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
              : value !== undefined && n <= value
                ? 'bg-violet-500/20 text-violet-300'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          } ${disabled ? 'opacity-50' : 'active:scale-95'}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
