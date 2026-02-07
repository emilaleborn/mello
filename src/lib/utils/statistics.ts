import type { VoteAggregate, Entry } from '@/types';

export interface RankedEntry extends Entry {
  rank: number;
  avg: number;
  count: number;
  sum: number;
}

export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Calculate agreement index from a set of ratings (1-10 scale).
 * Returns a value 0-100, where 100 = perfect agreement (everyone voted the same).
 * Formula: 100 - (stdDev / maxPossibleStdDev * 100)
 * Max possible stdDev for 1-10 scale is 4.5
 */
export function calculateAgreementIndex(ratings: number[]): number {
  if (ratings.length <= 1) return 100;
  const MAX_STD_DEV = 4.5;
  const stdDev = standardDeviation(ratings);
  const index = 100 - (stdDev / MAX_STD_DEV) * 100;
  return Math.max(0, Math.min(100, index));
}

/**
 * Sort entries by their aggregate avg score (descending) and return a ranked list.
 */
export function calculatePartyRankings(
  aggregates: VoteAggregate,
  entries: Entry[],
): RankedEntry[] {
  const ranked = entries
    .map((entry) => {
      const agg = aggregates[entry.id];
      return {
        ...entry,
        rank: 0,
        avg: agg?.avg ?? 0,
        count: agg?.count ?? 0,
        sum: agg?.sum ?? 0,
      };
    })
    .sort((a, b) => b.avg - a.avg || b.count - a.count);

  ranked.forEach((item, index) => {
    item.rank = index + 1;
  });

  return ranked;
}
