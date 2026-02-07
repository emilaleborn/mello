import { create } from 'zustand';
import type { UserVote, EventVotes } from '@/types';

interface VotingState {
  draftRatings: Record<string, number>;
  draftFavorite: string | null;
  submittedVote: UserVote | null;
  aggregates: EventVotes | null;
  setDraftRating: (entryId: string, score: number) => void;
  setDraftFavorite: (entryId: string | null) => void;
  resetDraft: () => void;
  setSubmittedVote: (vote: UserVote | null) => void;
  setAggregates: (aggregates: EventVotes | null) => void;
}

export const useVotingStore = create<VotingState>((set) => ({
  draftRatings: {},
  draftFavorite: null,
  submittedVote: null,
  aggregates: null,
  setDraftRating: (entryId, score) =>
    set((state) => ({
      draftRatings: { ...state.draftRatings, [entryId]: score },
    })),
  setDraftFavorite: (entryId) => set({ draftFavorite: entryId }),
  resetDraft: () => set({ draftRatings: {}, draftFavorite: null }),
  setSubmittedVote: (vote) => set({ submittedVote: vote }),
  setAggregates: (aggregates) => set({ aggregates }),
}));
