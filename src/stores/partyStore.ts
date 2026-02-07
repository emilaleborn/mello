import { create } from 'zustand';
import type { Party } from '@/types';

interface PartyState {
  parties: Party[];
  currentParty: Party | null;
  setParties: (parties: Party[]) => void;
  setCurrentParty: (party: Party | null) => void;
}

export const usePartyStore = create<PartyState>((set) => ({
  parties: [],
  currentParty: null,
  setParties: (parties) => set({ parties }),
  setCurrentParty: (party) => set({ currentParty: party }),
}));
