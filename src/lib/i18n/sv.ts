export const sv = {
  // General
  appName: 'Mello',
  loading: 'Laddar...',
  error: 'Något gick fel',
  save: 'Spara',
  cancel: 'Avbryt',
  close: 'Stäng',
  back: 'Tillbaka',

  // Auth
  signInWithGoogle: 'Logga in med Google',
  continueAsGuest: 'Fortsätt som gäst',
  enterNickname: 'Ange ett smeknamn',
  signOut: 'Logga ut',
  or: 'eller',
  joinAs: 'Gå med som',

  // Navigation
  navHome: 'Hem',
  navEvent: 'Event',
  navParty: 'Sällskap',
  navProfile: 'Profil',

  // Home
  myParties: 'Mina sällskap',
  welcomeTitle: 'Välkommen till Mello!',
  welcomeSubtitle: 'Skapa eller gå med i ett sällskap för att börja rösta.',
  createParty: 'Skapa sällskap',
  joinParty: 'Gå med i sällskap',
  enterCode: 'Ange kod',

  // Events
  nextEvent: 'Nästa',
  tonight: 'Ikväll!',
  live: 'LIVE',
  votingClosed: 'Stängd',
  results: 'Resultat',
  seasonComplete: 'Säsongen avslutad',
  eventNotFound: 'Event hittades inte.',
  joinPartyToVote: 'Gå med i ett sällskap för att rösta tillsammans!',

  // Voting
  votingOpen: 'Röstningen är öppen!',
  votingClosedBanner: 'Röstningen är stängd',
  votedCount: 'har röstat',
  of: 'av',
  submitVote: 'Skicka in röst',
  updateVote: 'Uppdatera röst',
  rateAllEntries: 'Betygsätt alla bidrag',
  votes: 'röster',

  // Party
  partyName: 'Sällskapets namn',
  create: 'Skapa',
  joinCode: 'Kod',
  join: 'Gå med',
  copyLink: 'Kopiera länk',
  shareParty: 'Dela sällskap',
  share: 'Dela',
  members: 'Medlemmar',
  copied: 'Kopierad!',
  qrCode: 'QR-kod',
  joinPartyTitle: 'Gå med i sällskap',
  joining: 'Går med...',
  invalidCode: 'Ogiltig kod',

  // Stats
  statistics: 'Statistik',
  leaderboard: 'Topplista',
  agreementIndex: 'Enighetsindex',
  partyRankings: 'Sällskapets ranking',
  overallAgreement: 'Total enighet',
  avgScore: 'Snittpoäng',

  // Profile
  profile: 'Profil',
  myVoteHistory: 'Mina röster',

  // PWA
  installApp: 'Installera Mello-appen',
  installInstructions: 'Tryck på Dela → Lägg till på hemskärmen',
  install: 'Installera',
  dismiss: 'Inte nu',

  // Offline
  offlineTitle: 'Du är offline',
  offlineMessage: 'Anslut till internet för att använda Mello.',

  // Results
  waitingForVotes: 'Väntar på att alla röstar...',
  resultsRevealed: 'Resultat',
  favoriteDistribution: 'Favoritfördelning',
  hasVoted: 'Har röstat',
  hasNotVoted: 'Har inte röstat',
} as const;
