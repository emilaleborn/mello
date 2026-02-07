import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  displayName: string;
  photoURL: string | null;
  isAnonymous: boolean;
  createdAt: Timestamp;
}

export interface Party {
  id: string;
  name: string;
  createdBy: string;
  joinCode: string;
  members: string[];
  memberNames: Record<string, string>;
  memberPhotos: Record<string, string | null>;
  createdAt: Timestamp;
}

export interface MelloEvent {
  id: string;
  type: 'semifinal' | 'finalkval' | 'final';
  number?: number;
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  city: string;
  arena: string;
}

export interface Entry {
  id: string;
  eventId: string;
  startNumber: number;
  artist: string;
  song: string;
  songwriters: string[];
  bio?: string;
}

export interface UserVote {
  userId: string;
  ratings: Record<string, number>; // entryId -> 1-10
  favorite: string | null; // entryId
  votedAt: Timestamp;
  updatedAt: Timestamp;
}

export interface VoteAggregate {
  [entryId: string]: {
    sum: number;
    count: number;
    avg: number;
  };
}

export interface EventVotes {
  aggregates: VoteAggregate;
  voterIds: string[];
}

export type EventStatus =
  | 'UPCOMING'
  | 'TODAY_COUNTDOWN'
  | 'VOTING_OPEN'
  | 'VOTING_CLOSED'
  | 'RESULTS'
  | 'SEASON_COMPLETE';

export interface EventState {
  event: MelloEvent;
  status: EventStatus;
}

export interface OfficialResults {
  toFinal: string[];
  toFinalkval: string | null;
  eliminated: string[];
}
