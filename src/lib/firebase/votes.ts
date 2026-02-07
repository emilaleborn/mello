import {
  doc,
  runTransaction,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './config';
import type { UserVote, EventVotes } from '@/types';

export async function submitVote(
  partyId: string,
  eventId: string,
  userId: string,
  ratings: Record<string, number>,
  favorite: string | null,
): Promise<void> {
  const aggregateRef = doc(db, 'parties', partyId, 'votes', eventId);
  const userVoteRef = doc(db, 'parties', partyId, 'votes', eventId, 'userVotes', userId);

  await runTransaction(db, async (transaction) => {
    const aggregateSnap = await transaction.get(aggregateRef);
    const userVoteSnap = await transaction.get(userVoteRef);

    const currentAggregates: EventVotes = aggregateSnap.exists()
      ? (aggregateSnap.data() as EventVotes)
      : { aggregates: {}, voterIds: [] };

    const oldVote = userVoteSnap.exists() ? (userVoteSnap.data() as UserVote) : null;

    const newAggregates = { ...currentAggregates.aggregates };

    // If re-voting, subtract old values
    if (oldVote) {
      for (const [entryId, score] of Object.entries(oldVote.ratings)) {
        if (newAggregates[entryId]) {
          newAggregates[entryId] = {
            sum: newAggregates[entryId].sum - score,
            count: newAggregates[entryId].count - 1,
            avg: 0,
          };
        }
      }
    }

    // Add new values
    for (const [entryId, score] of Object.entries(ratings)) {
      if (!newAggregates[entryId]) {
        newAggregates[entryId] = { sum: 0, count: 0, avg: 0 };
      }
      newAggregates[entryId] = {
        sum: newAggregates[entryId].sum + score,
        count: newAggregates[entryId].count + 1,
        avg: 0,
      };
    }

    // Recalculate averages
    for (const entryId of Object.keys(newAggregates)) {
      const { sum, count } = newAggregates[entryId];
      newAggregates[entryId].avg = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
    }

    const voterIds = currentAggregates.voterIds.includes(userId)
      ? currentAggregates.voterIds
      : [...currentAggregates.voterIds, userId];

    transaction.set(aggregateRef, {
      aggregates: newAggregates,
      voterIds,
    });

    const now = serverTimestamp();
    transaction.set(userVoteRef, {
      userId,
      ratings,
      favorite,
      votedAt: oldVote ? oldVote.votedAt : now,
      updatedAt: now,
    });
  });
}

export function subscribeToAggregates(
  partyId: string,
  eventId: string,
  callback: (data: EventVotes | null) => void,
): () => void {
  return onSnapshot(doc(db, 'parties', partyId, 'votes', eventId), (snap) => {
    if (snap.exists()) {
      callback(snap.data() as EventVotes);
    } else {
      callback(null);
    }
  });
}

export function subscribeToUserVote(
  partyId: string,
  eventId: string,
  userId: string,
  callback: (vote: UserVote | null) => void,
): () => void {
  return onSnapshot(
    doc(db, 'parties', partyId, 'votes', eventId, 'userVotes', userId),
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as UserVote);
      } else {
        callback(null);
      }
    },
  );
}
