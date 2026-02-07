import { create } from 'zustand';
import type { UserVote, EventVotes } from '@/types';

export type SavingStatus = 'saving' | 'saved' | 'error';

interface VotingState {
  draftRatings: Record<string, number>;
  draftFavorite: string | null;
  submittedVote: UserVote | null;
  aggregates: EventVotes | null;
  savingEntries: Record<string, SavingStatus>;
  savingFavorite: boolean;
  setDraftRating: (entryId: string, score: number) => void;
  setDraftFavorite: (entryId: string | null) => void;
  resetDraft: () => void;
  setSubmittedVote: (vote: UserVote | null) => void;
  setAggregates: (aggregates: EventVotes | null) => void;
  setSavingStatus: (entryId: string, status: SavingStatus) => void;
  clearSavingStatus: (entryId: string) => void;
  setSavingFavorite: (saving: boolean) => void;
}

export const useVotingStore = create<VotingState>((set) => ({
  draftRatings: {},
  draftFavorite: null,
  submittedVote: null,
  aggregates: null,
  savingEntries: {},
  savingFavorite: false,
  setDraftRating: (entryId, score) =>
    set((state) => ({
      draftRatings: { ...state.draftRatings, [entryId]: score },
    })),
  setDraftFavorite: (entryId) => set({ draftFavorite: entryId }),
  resetDraft: () => set({ draftRatings: {}, draftFavorite: null, savingEntries: {}, savingFavorite: false }),
  setSubmittedVote: (vote) => set({ submittedVote: vote }),
  setAggregates: (aggregates) => set({ aggregates }),
  setSavingStatus: (entryId, status) =>
    set((state) => ({
      savingEntries: { ...state.savingEntries, [entryId]: status },
    })),
  clearSavingStatus: (entryId) =>
    set((state) => {
      const { [entryId]: _, ...rest } = state.savingEntries;
      return { savingEntries: rest };
    }),
  setSavingFavorite: (saving) => set({ savingFavorite: saving }),
}));
