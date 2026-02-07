/**
 * Seed script for Firebase Emulator.
 * Run with: npm run seed
 * Requires: FIRESTORE_EMULATOR_HOST=localhost:8080
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize admin SDK for emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

if (getApps().length === 0) {
  initializeApp({ projectId: 'demo-mello-app' });
}

const db = getFirestore();

// ─── Event data ──────────────────────────────────────────────────────

const events = [
  { id: 'dt1', type: 'semifinal', number: 1, name: 'Deltävling 1', date: '2026-01-31', time: '20:00', city: 'Linköping', arena: 'Saab Arena' },
  { id: 'dt2', type: 'semifinal', number: 2, name: 'Deltävling 2', date: '2026-02-07', time: '20:00', city: 'Göteborg', arena: 'Scandinavium' },
  { id: 'dt3', type: 'semifinal', number: 3, name: 'Deltävling 3', date: '2026-02-14', time: '20:00', city: 'Kristianstad', arena: 'Kristianstad Arena' },
  { id: 'dt4', type: 'semifinal', number: 4, name: 'Deltävling 4', date: '2026-02-21', time: '20:00', city: 'Malmö', arena: 'Malmö Arena' },
  { id: 'dt5', type: 'semifinal', number: 5, name: 'Deltävling 5', date: '2026-02-28', time: '20:00', city: 'Sundsvall', arena: 'Gärdehov Arena' },
  { id: 'finalkval', type: 'finalkval', name: 'Finalkval', date: '2026-02-28', time: '21:30', city: 'Sundsvall', arena: 'Gärdehov Arena' },
  { id: 'final', type: 'final', name: 'Final', date: '2026-03-07', time: '20:00', city: 'Stockholm', arena: 'Strawberry Arena' },
];

const entriesByEvent: Record<string, Array<{ startNumber: number; artist: string; song: string; songwriters: string[] }>> = {
  dt1: [
    { startNumber: 1, artist: 'Greczula', song: 'Half of me', songwriters: ['Andreas Werling', 'Karl Ivert', 'Kian Sang', 'Greczula'] },
    { startNumber: 2, artist: 'Jacqline', song: 'Woman', songwriters: ['Dino Medanhodzic', 'Jimmy Jansson', 'Moa "Cazzi Opeia" Carlebecker', 'Thomas G:son'] },
    { startNumber: 3, artist: 'Noll2', song: 'Berusade ord', songwriters: ['Fredrik Andersson', 'Jakob Westerlund', 'Wilmer Öberg'] },
    { startNumber: 4, artist: 'Junior Lerin', song: 'Copacabana boy', songwriters: ['Fredrik Andersson'] },
    { startNumber: 5, artist: 'Indra', song: 'Beautiful lie', songwriters: ['Anderz Wrethov', 'Indra', 'Kristofer Strandberg', 'Laurell Barker', 'Robert Skowronski'] },
    { startNumber: 6, artist: 'A-Teens', song: 'Iconic', songwriters: ['Dino Medanhodzic', 'Jimmy Jansson', 'Lina Hansson', 'Moa "Cazzi Opeia" Carlebecker', 'Thomas G:son'] },
  ],
  dt2: [
    { startNumber: 1, artist: 'Arwin', song: 'Glitter', songwriters: ['Arwin Ismail', 'Axel Schylström', 'Dino Medanhodzic', 'Melanie Wehbe', 'Robert Skowronski'] },
    { startNumber: 2, artist: 'Laila Adèle', song: 'Oxygen', songwriters: ['Jonas Thander', 'Laila Adèle', 'Marcus Winther-John'] },
    { startNumber: 3, artist: 'Robin Bengtsson', song: 'Honey honey', songwriters: ['Gavin Jones', 'Pär Westerlund', 'Petter Tarland', 'Robin Bengtsson'] },
    { startNumber: 4, artist: 'Felicia', song: 'My system', songwriters: ['Audun Agnar', 'Emily Harbakk', 'Felicia', 'Julie Bergan', 'Theresa Rex'] },
    { startNumber: 5, artist: 'Klara Almström', song: 'Där hela världen väntar', songwriters: ['Fredrik Sonefors', 'Jimmy Jansson', 'Klara Almström'] },
    { startNumber: 6, artist: 'Brandsta City Släckers', song: 'Rakt in i elden', songwriters: ['Anderz Wrethov', 'Elin Wrethov', 'Kristofer Strandberg', 'Robert Skowronski'] },
  ],
  dt3: [
    { startNumber: 1, artist: 'Patrik Jean', song: 'Dusk till dawn', songwriters: ['David Lindgren Zacharias', 'Joy Deb', 'Melanie Wehbe', 'Patrik Jean'] },
    { startNumber: 2, artist: 'Korslagda', song: "King of Rock'n roll", songwriters: ['Andreas Werling', 'Pedro Sanchez', 'Kristofer Strandberg', 'Stefan "UBBE" Sjur'] },
    { startNumber: 3, artist: 'Emilia Pantić', song: 'Ingenting', songwriters: ['Emilia Pantić', 'Fredrik Andersson', 'Jakob Westerlund', 'Theodor Ström', 'Wilmer Öberg'] },
    { startNumber: 4, artist: 'Medina', song: "Viva l'amor", songwriters: ['Ali "Alibrorsh" Jammali', 'Anderz Wrethov', 'Dino Medanhodzic', 'Jimmy "Joker" Thörnfeldt', 'Sami Rekik'] },
    { startNumber: 5, artist: 'Eva Jumatate', song: 'Selfish', songwriters: ['Eva Jumatate', 'Herman Gardarfve', 'Marlene Strand', 'Ruth Lindegren'] },
    { startNumber: 6, artist: 'Saga Ludvigsson', song: "Ain't today", songwriters: ['Dino Medanhodzic', 'Jimmy Jansson', 'Johanna "Dotter" Jansson', 'Saga Ludvigsson'] },
  ],
  dt4: [
    { startNumber: 1, artist: 'Cimberly', song: 'Eternity', songwriters: ['Cimberly-Malaika Wanyonyi', 'David Lindgren Zacharias', 'Dino Medanhodzic', 'Melanie Wehbe'] },
    { startNumber: 2, artist: 'Timo Räisänen', song: 'Ingenting är efter oss', songwriters: ['Andreas "Giri" Lindbergh', 'Jimmy "Joker" Thörnfeldt', 'Joy Deb', 'Lina Räisänen', 'Linnea Deb', 'Timo Räisänen'] },
    { startNumber: 3, artist: 'Meira Omar', song: 'Dooset daram', songwriters: ['Anderz Wrethov', 'Jimmy "Joker" Thörnfeldt', 'Laurell Barker', 'Meira Omar'] },
    { startNumber: 4, artist: 'Felix Manu', song: 'Hatar att jag älskar dig', songwriters: ['Axel Schylström', 'Felix Manu', 'Fernand MP', 'Karl Flyckt'] },
    { startNumber: 5, artist: 'Erika Jonsson', song: 'Från landet', songwriters: ['Amir Aly', 'Erika Jonsson', 'Mikael Karlsson'] },
    { startNumber: 6, artist: 'Smash Into Pieces', song: 'Hollow', songwriters: ['Benjamin Jennebo', 'Chris Adam Hedman Sörbye', 'Per Bergquist', 'Philip Strand'] },
  ],
  dt5: [
    { startNumber: 1, artist: 'Alexa', song: 'Tongue tied', songwriters: ['Alexa', 'Moonshine (Jonatan Gusmark & Ludvig Evers)', 'Sunshine (Ellen Berg & Moa "Cazzi Opeia" Carlebecker)'] },
    { startNumber: 2, artist: 'Juliett', song: 'Långt från alla andra', songwriters: ['David Själin', 'Elias Kask', 'Herman Gardarfve', 'Ludvig Alamanos', 'Romeo Er-Melin', 'Valter Wigren'] },
    { startNumber: 3, artist: 'Bladë', song: 'Who you are', songwriters: ['Isa Tengblad', 'Josefina Carlbom'] },
    { startNumber: 4, artist: 'Lilla Al-Fadji', song: 'Delulu', songwriters: ['Daniel Réhn', 'Edward af Sillén', 'Lilla Al-Fadji', 'Fredrik Sonefors', 'Melanie Wehbe', 'Mikaela Samuelsson'] },
    { startNumber: 5, artist: 'Vilhelm Buchaus', song: "Hearts don't lie", songwriters: ['David Zandén', 'Isa Molin', 'Vilhelm Buchaus'] },
    { startNumber: 6, artist: 'Sanna Nielsen', song: 'Waste your love', songwriters: ['Jimmy Jansson', 'Peter Boström', 'Thomas G:son'] },
  ],
};

// ─── Test users ──────────────────────────────────────────────────────

const testUsers = [
  { id: 'user-alice', displayName: 'Alice', photoURL: null, isAnonymous: false },
  { id: 'user-bob', displayName: 'Bob', photoURL: null, isAnonymous: true },
  { id: 'user-charlie', displayName: 'Charlie', photoURL: null, isAnonymous: false },
];

// ─── Test party ──────────────────────────────────────────────────────

const testParty = {
  id: 'party-test',
  name: 'Mello-gänget',
  createdBy: 'user-alice',
  joinCode: 'ABC123',
  members: ['user-alice', 'user-bob', 'user-charlie'],
  memberNames: { 'user-alice': 'Alice', 'user-bob': 'Bob', 'user-charlie': 'Charlie' },
  memberPhotos: { 'user-alice': null, 'user-bob': null, 'user-charlie': null },
};

// ─── Sample votes (for DT1) ─────────────────────────────────────────

const sampleVotes: Array<{ userId: string; ratings: Record<string, number>; favorite: string }> = [
  {
    userId: 'user-alice',
    ratings: { 'dt1-1': 8, 'dt1-2': 5, 'dt1-3': 7, 'dt1-4': 4, 'dt1-5': 6, 'dt1-6': 9 },
    favorite: 'dt1-6',
  },
  {
    userId: 'user-bob',
    ratings: { 'dt1-1': 7, 'dt1-2': 6, 'dt1-3': 8, 'dt1-4': 5, 'dt1-5': 7, 'dt1-6': 8 },
    favorite: 'dt1-3',
  },
  {
    userId: 'user-charlie',
    ratings: { 'dt1-1': 9, 'dt1-2': 4, 'dt1-3': 6, 'dt1-4': 3, 'dt1-5': 8, 'dt1-6': 10 },
    favorite: 'dt1-6',
  },
];

// ─── Seed function ───────────────────────────────────────────────────

async function seed() {
  console.log('Seeding Firestore emulator...');

  const batch = db.batch();

  // Events
  for (const event of events) {
    const ref = db.collection('events').doc(event.id);
    batch.set(ref, {
      type: event.type,
      number: event.number ?? null,
      name: event.name,
      date: event.date,
      time: event.time,
      city: event.city,
      arena: event.arena,
      votingOpen: false,
    });

    // Entries for this event
    const entries = entriesByEvent[event.id];
    if (entries) {
      for (const entry of entries) {
        const entryId = `${event.id}-${entry.startNumber}`;
        const entryRef = db.collection('events').doc(event.id).collection('entries').doc(entryId);
        batch.set(entryRef, {
          startNumber: entry.startNumber,
          artist: entry.artist,
          song: entry.song,
          songwriters: entry.songwriters,
          result: null,
        });
      }
    }
  }

  // Users
  for (const user of testUsers) {
    const ref = db.collection('users').doc(user.id);
    batch.set(ref, {
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous,
      createdAt: Timestamp.now(),
    });
  }

  // Party
  const partyRef = db.collection('parties').doc(testParty.id);
  batch.set(partyRef, {
    name: testParty.name,
    createdBy: testParty.createdBy,
    joinCode: testParty.joinCode,
    members: testParty.members,
    memberNames: testParty.memberNames,
    memberPhotos: testParty.memberPhotos,
    createdAt: Timestamp.now(),
  });

  // Votes for DT1 in the test party
  const voteDocRef = db.collection('parties').doc(testParty.id).collection('votes').doc('dt1');

  // Compute aggregates
  const aggregates: Record<string, { sum: number; count: number; avg: number }> = {};
  for (const entryId of Object.keys(sampleVotes[0].ratings)) {
    let sum = 0;
    let count = 0;
    for (const vote of sampleVotes) {
      if (vote.ratings[entryId] !== undefined) {
        sum += vote.ratings[entryId];
        count++;
      }
    }
    aggregates[entryId] = { sum, count, avg: Math.round((sum / count) * 10) / 10 };
  }

  batch.set(voteDocRef, {
    aggregates,
    voterIds: sampleVotes.map((v) => v.userId),
  });

  // Individual user votes
  for (const vote of sampleVotes) {
    const userVoteRef = voteDocRef.collection('userVotes').doc(vote.userId);
    batch.set(userVoteRef, {
      userId: vote.userId,
      ratings: vote.ratings,
      favorite: vote.favorite,
      votedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  await batch.commit();
  console.log('Seed complete!');
  console.log(`  - ${events.length} events with entries`);
  console.log(`  - ${testUsers.length} test users`);
  console.log(`  - 1 test party with ${sampleVotes.length} votes for DT1`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
