export const sv = {
  // App
  appName: 'Mello',
  appDescription: 'Rösta på Melodifestivalen med dina vänner',

  // Auth
  signInWithGoogle: 'Logga in med Google',
  continueAsGuest: 'Fortsätt som gäst',
  enterNickname: 'Ange ett smeknamn',
  joinAs: 'Gå med som',
  signInFailed: 'Inloggningen misslyckades',
  pleaseEnterNickname: 'Ange ett smeknamn',
  signOut: 'Logga ut',
  or: 'eller',
  voteOnMello: 'Rösta på Melodifestivalen med vänner',

  // Navigation
  navHome: 'Hem',
  navEvent: 'Event',
  navParty: 'Sällskap',
  navProfile: 'Profil',

  // Home
  myParties: 'Mina sällskap',
  welcomeToMello: 'Välkommen till Mello!',
  createOrJoinParty: 'Skapa eller gå med i ett sällskap för att börja rösta.',
  createParty: 'Skapa sällskap',
  joinParty: 'Gå med i sällskap',
  join: 'Gå med',
  enterCode: 'Ange kod',

  // Event statuses
  statusUpcoming: 'Nästa',
  statusTonight: 'Ikväll!',
  statusLive: 'LIVE',
  statusClosed: 'Stängd',
  statusResults: 'Resultat',
  statusSeasonComplete: 'Säsongen avslutad',

  // Voting
  votingOpen: 'Röstningen är öppen!',
  votingClosed: 'Röstningen är stängd',
  waitingForShow: 'Väntar på sändningsstart',
  xOfYVoted: (x: number, y: number) => `${x} av ${y} har röstat`,
  submitVote: 'Skicka in röst',
  updateVote: 'Uppdatera röst',
  submitting: 'Skickar...',
  markAsFavorite: 'Markera som favorit',
  removeFavorite: 'Ta bort som favorit',
  partyAverage: 'Sällskapets snitt',
  joinPartyToVote: 'Gå med i ett sällskap för att rösta tillsammans!',
  eventNotFound: 'Event hittades inte.',

  // Party
  partyNamePlaceholder: 'Namn på sällskapet',
  creating: 'Skapar...',
  create: 'Skapa',
  cancel: 'Avbryt',
  createPartyError: 'Kunde inte skapa sällskapet. Försök igen.',
  members: (n: number) => `${n} ${n === 1 ? 'medlem' : 'medlemmar'}`,
  noPartiesYet: 'Du är inte med i något sällskap ännu. Skapa ett eller gå med via en kod!',

  // Profile
  googleAccount: 'Google-konto',
  anonymous: 'Anonym',

  // Loading
  loading: 'Laddar...',
} as const;
