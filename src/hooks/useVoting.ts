'use client';

import { useEffect, useCallback } from 'react';
import { useVotingStore } from '@/stores/votingStore';
import { useAuthStore } from '@/stores/authStore';
import {
  submitVote as submitVoteToFirestore,
  subscribeToAggregates,
  subscribeToUserVote,
} from '@/lib/firebase/votes';

export function useVoting(partyId: string | null, eventId: string | null) {
  const user = useAuthStore((s) => s.user);
  const {
    draftRatings,
    draftFavorite,
    submittedVote,
    aggregates,
    setDraftRating,
    setDraftFavorite,
    resetDraft,
    setSubmittedVote,
    setAggregates,
  } = useVotingStore();

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
        // Populate draft from submitted vote
        for (const [entryId, score] of Object.entries(vote.ratings)) {
          setDraftRating(entryId, score);
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

  const submitVote = useCallback(async () => {
    if (!partyId || !eventId || !user) return;
    await submitVoteToFirestore(partyId, eventId, user.uid, draftRatings, draftFavorite);
  }, [partyId, eventId, user, draftRatings, draftFavorite]);

  return {
    draftRatings,
    draftFavorite,
    submittedVote,
    aggregates,
    setDraftRating,
    setDraftFavorite,
    submitVote,
    hasVoted: submittedVote !== null,
  };
}
