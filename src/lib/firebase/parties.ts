import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { trackEvent } from './analytics';
import { generateJoinCode } from '@/lib/utils/joinCode';
import type { Party } from '@/types';

export async function createParty(
  name: string,
  userId: string,
  userName: string,
  userPhoto: string | null,
): Promise<Party> {
  const joinCode = generateJoinCode();
  const partyRef = doc(collection(db, 'parties'));
  const party = {
    name,
    createdBy: userId,
    joinCode,
    members: [userId],
    memberNames: { [userId]: userName },
    memberPhotos: { [userId]: userPhoto },
    createdAt: serverTimestamp(),
  };

  await setDoc(partyRef, party);
  trackEvent('create_party');

  return {
    ...party,
    id: partyRef.id,
    createdAt: null!,
  } as Party;
}

export async function joinParty(
  joinCode: string,
  userId: string,
  userName: string,
  userPhoto: string | null,
): Promise<Party | null> {
  const q = query(collection(db, 'parties'), where('joinCode', '==', joinCode.toUpperCase()));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const partyDoc = snap.docs[0];
  const partyRef = doc(db, 'parties', partyDoc.id);

  await updateDoc(partyRef, {
    members: arrayUnion(userId),
    [`memberNames.${userId}`]: userName,
    [`memberPhotos.${userId}`]: userPhoto,
  });
  trackEvent('join_party');

  const data = partyDoc.data();
  return {
    id: partyDoc.id,
    ...data,
    members: [...data.members, userId],
    memberNames: { ...data.memberNames, [userId]: userName },
    memberPhotos: { ...data.memberPhotos, [userId]: userPhoto },
  } as Party;
}

export async function getUserParties(userId: string): Promise<Party[]> {
  const q = query(collection(db, 'parties'), where('members', 'array-contains', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Party);
}

export function subscribeToParty(
  partyId: string,
  callback: (party: Party) => void,
): () => void {
  return onSnapshot(doc(db, 'parties', partyId), (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() } as Party);
    }
  });
}

export async function removeMember(partyId: string, memberUid: string): Promise<void> {
  const partyRef = doc(db, 'parties', partyId);
  await updateDoc(partyRef, {
    members: arrayRemove(memberUid),
    [`memberNames.${memberUid}`]: deleteField(),
    [`memberPhotos.${memberUid}`]: deleteField(),
  });
}

export function subscribeToUserParties(
  userId: string,
  callback: (parties: Party[]) => void,
): () => void {
  const q = query(collection(db, 'parties'), where('members', 'array-contains', userId));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Party));
  });
}
