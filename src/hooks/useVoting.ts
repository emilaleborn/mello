'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useVotingStore } from '@/stores/votingStore';
import { useAuthStore } from '@/stores/authStore';
import {
  submitEntryVote,
  submitFavorite as submitFavoriteToFirestore,
  subscribeToAggregates,
  subscribeToUserVote,
} from '@/lib/firebase/votes';

const DEBOUNCE_MS = 500;
const SAVED_DISPLAY_MS = 1500;

export function useVoting(partyId: string | null, eventId: string | null) {
  const user = useAuthStore((s) => s.user);
  const {
    draftRatings,
    draftFavorite,
    submittedVote,
    aggregates,
    savingEntries,
    setDraftRating,
    setDraftFavorite,
    resetDraft,
    setSubmittedVote,
    setAggregates,
    setSavingStatus,
    clearSavingStatus,
    setSavingFavorite,
  } = useVotingStore();

  // Track pending debounce timers per entry
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // Track entries with pending debounces to avoid snapshot overwrite
  const pendingEntries = useRef<Set<string>>(new Set());

  // Subscribe to aggregates
  useEffect(() => {
    if (!partyId || !eventId) return;
    const unsub = subscribeToAggregates(partyId, eventId, setAggregates);
    return () => unsub();
  }, [partyId, eventId, setAggregates]);

  // Subscribe to user vote
  useEffect(() => {
    if (!partyId || !eventId || !user) return;
    const unsub = subscribeToUserVote(partyId, eventId, user.uid, (vote) => {
      setSubmittedVote(vote);
      if (vote) {
        // Populate draft from submitted vote, but skip entries with pending debounce
        for (const [entryId, score] of Object.entries(vote.ratings)) {
          if (!pendingEntries.current.has(entryId)) {
            setDraftRating(entryId, score);
          }
        }
        if (vote.favorite !== undefined) {
          setDraftFavorite(vote.favorite);
        }
      }
    });
    return () => unsub();
  }, [partyId, eventId, user, setSubmittedVote, setDraftRating, setDraftFavorite]);

  // Reset draft when party/event changes
  useEffect(() => {
    return () => resetDraft();
  }, [partyId, eventId, resetDraft]);

  // Flush all pending debounce timers on unmount
  useEffect(() => {
    return () => {
      const timers = debounceTimers.current;
      for (const entryId of Object.keys(timers)) {
        clearTimeout(timers[entryId]);
        delete timers[entryId];
      }
      // Fire immediate saves for all pending entries
      const pending = pendingEntries.current;
      if (pending.size > 0 && partyId && eventId && user) {
        const ratings = useVotingStore.getState().draftRatings;
        for (const entryId of pending) {
          const score = ratings[entryId];
          if (score !== undefined) {
            submitEntryVote(partyId, eventId, user.uid, entryId, score).catch(() => {});
          }
        }
        pending.clear();
      }
    };
  }, [partyId, eventId, user]);

  const rateEntry = useCallback(
    (entryId: string, score: number) => {
      // Update local draft immediately
      setDraftRating(entryId, score);

      if (!partyId || !eventId || !user) return;

      // Cancel any pending debounce for this entry
      if (debounceTimers.current[entryId]) {
        clearTimeout(debounceTimers.current[entryId]);
      }

      // Mark entry as pending
      pendingEntries.current.add(entryId);

      // Start debounce timer
      debounceTimers.current[entryId] = setTimeout(async () => {
        delete debounceTimers.current[entryId];
        pendingEntries.current.delete(entryId);

        setSavingStatus(entryId, 'saving');
        try {
          // Read the latest draft score at fire time
          const latestScore = useVotingStore.getState().draftRatings[entryId];
          await submitEntryVote(partyId, eventId, user.uid, entryId, latestScore ?? score);
          setSavingStatus(entryId, 'saved');
          setTimeout(() => clearSavingStatus(entryId), SAVED_DISPLAY_MS);
        } catch {
          setSavingStatus(entryId, 'error');
        }
      }, DEBOUNCE_MS);
    },
    [partyId, eventId, user, setDraftRating, setSavingStatus, clearSavingStatus],
  );

  const toggleFavorite = useCallback(
    async (entryId: string) => {
      if (!partyId || !eventId || !user) return;

      const newFavorite = draftFavorite === entryId ? null : entryId;
      // Update local draft immediately
      setDraftFavorite(newFavorite);

      setSavingFavorite(true);
      try {
        await submitFavoriteToFirestore(partyId, eventId, user.uid, newFavorite);
      } catch {
        // Revert on error
        setDraftFavorite(draftFavorite);
      } finally {
        setSavingFavorite(false);
      }
    },
    [partyId, eventId, user, draftFavorite, setDraftFavorite, setSavingFavorite],
  );

  return {
    draftRatings,
    draftFavorite,
    submittedVote,
    aggregates,
    savingEntries,
    setDraftRating,
    setDraftFavorite,
    rateEntry,
    toggleFavorite,
    hasVoted: submittedVote !== null,
  };
}
