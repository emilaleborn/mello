# Mello Appen – Produktspecifikation

## 1. Översikt

**Mello Appen** är en Progressive Web App (PWA) där vänner kan skapa sällskap, rösta på Melodifestivalens bidrag tillsammans, och följa statistik i realtid. Appen hanterar varje deltävling separat och vet automatiskt vilken deltävling som är aktuell.

**Teknikstack:** React/Next.js PWA, Firebase (Auth, Firestore, Hosting), installationsbar på mobil via "Lägg till på hemskärmen".

---

## 2. Melodifestivalen 2026 – Datamodell

### 2.1 Schema & Datum

| Event | Datum | Tid | Stad | Arena |
|-------|-------|-----|------|-------|
| Deltävling 1 | 2026-01-31 | 20:00 | Linköping | Saab Arena |
| Deltävling 2 | 2026-02-07 | 20:00 | Göteborg | Scandinavium |
| Deltävling 3 | 2026-02-14 | 20:00 | Kristianstad | Kristianstad Arena |
| Deltävling 4 | 2026-02-21 | 20:00 | Malmö | Malmö Arena |
| Deltävling 5 | 2026-02-28 | 20:00 | Sundsvall | Gärdehov Arena |
| Finalkval | 2026-02-28 | 21:30 | Sundsvall | Gärdehov Arena |
| Final | 2026-03-07 | 20:00 | Stockholm | Strawberry Arena |

### 2.2 Bidrag per deltävling

#### Deltävling 1 – Linköping, 31 januari
| # | Artist | Låt | Upphovspersoner |
|---|--------|-----|-----------------|
| 1 | Greczula | Half of me | Andreas Werling, Karl Ivert, Kian Sang, Greczula |
| 2 | Jacqline | Woman | Dino Medanhodzic, Jimmy Jansson, Moa "Cazzi Opeia" Carlebecker, Thomas G:son |
| 3 | Noll2 | Berusade ord | Fredrik Andersson, Jakob Westerlund, Wilmer Öberg |
| 4 | Junior Lerin | Copacabana boy | Fredrik Andersson |
| 5 | Indra | Beautiful lie | Anderz Wrethov, Indra, Kristofer Strandberg, Laurell Barker, Robert Skowronski |
| 6 | A-Teens | Iconic | Dino Medanhodzic, Jimmy Jansson, Lina Hansson, Moa "Cazzi Opeia" Carlebecker, Thomas G:son |

**Resultat DT1:** Till final: Greczula & A-Teens. Till finalkval: Jacqline.

#### Deltävling 2 – Göteborg, 7 februari
| # | Artist | Låt | Upphovspersoner |
|---|--------|-----|-----------------|
| 1 | Arwin | Glitter | Arwin Ismail, Axel Schylström, Dino Medanhodzic, Melanie Wehbe, Robert Skowronski |
| 2 | Laila Adèle | Oxygen | Jonas Thander, Laila Adèle, Marcus Winther-John |
| 3 | Robin Bengtsson | Honey honey | Gavin Jones, Pär Westerlund, Petter Tarland, Robin Bengtsson |
| 4 | Felicia | My system | Audun Agnar, Emily Harbakk, Felicia, Julie Bergan, Theresa Rex |
| 5 | Klara Almström | Där hela världen väntar | Fredrik Sonefors, Jimmy Jansson, Klara Almström |
| 6 | Brandsta City Släckers | Rakt in i elden | Anderz Wrethov, Elin Wrethov, Kristofer Strandberg, Robert Skowronski |

#### Deltävling 3 – Kristianstad, 14 februari
| # | Artist | Låt | Upphovspersoner |
|---|--------|-----|-----------------|
| 1 | Patrik Jean | Dusk till dawn | David Lindgren Zacharias, Joy Deb, Melanie Wehbe, Patrik Jean |
| 2 | Korslagda | King of Rock'n roll | Andreas Werling, Pedro Sanchez, Kristofer Strandberg, Stefan "UBBE" Sjur |
| 3 | Emilia Pantić | Ingenting | Emilia Pantić, Fredrik Andersson, Jakob Westerlund, Theodor Ström, Wilmer Öberg |
| 4 | Medina | Viva l'amor | Ali "Alibrorsh" Jammali, Anderz Wrethov, Dino Medanhodzic, Jimmy "Joker" Thörnfeldt, Sami Rekik |
| 5 | Eva Jumatate | Selfish | Eva Jumatate, Herman Gardarfve, Marlene Strand, Ruth Lindegren |
| 6 | Saga Ludvigsson | Ain't today | Dino Medanhodzic, Jimmy Jansson, Johanna "Dotter" Jansson, Saga Ludvigsson |

#### Deltävling 4 – Malmö, 21 februari
| # | Artist | Låt | Upphovspersoner |
|---|--------|-----|-----------------|
| 1 | Cimberly | Eternity | Cimberly-Malaika Wanyonyi, David Lindgren Zacharias, Dino Medanhodzic, Melanie Wehbe |
| 2 | Timo Räisänen | Ingenting är efter oss | Andreas "Giri" Lindbergh, Jimmy "Joker" Thörnfeldt, Joy Deb, Lina Räisänen, Linnea Deb, Timo Räisänen |
| 3 | Meira Omar | Dooset daram | Anderz Wrethov, Jimmy "Joker" Thörnfeldt, Laurell Barker, Meira Omar |
| 4 | Felix Manu | Hatar att jag älskar dig | Axel Schylström, Felix Manu, Fernand MP, Karl Flyckt |
| 5 | Erika Jonsson | Från landet | Amir Aly, Erika Jonsson, Mikael Karlsson |
| 6 | Smash Into Pieces | Hollow | Benjamin Jennebo, Chris Adam Hedman Sörbye, Per Bergquist, Philip Strand |

#### Deltävling 5 – Sundsvall, 28 februari
| # | Artist | Låt | Upphovspersoner |
|---|--------|-----|-----------------|
| 1 | Alexa | Tongue tied | Alexa, Moonshine (Jonatan Gusmark & Ludvig Evers), Sunshine (Ellen Berg & Moa "Cazzi Opeia" Carlebecker) |
| 2 | Juliett | Långt från alla andra | David Själin, Elias Kask, Herman Gardarfve, Ludvig Alamanos, Romeo Er-Melin, Valter Wigren |
| 3 | Bladë | Who you are | Isa Tengblad, Josefina Carlbom |
| 4 | Lilla Al-Fadji | Delulu | Daniel Réhn, Edward af Sillén, Lilla Al-Fadji, Fredrik Sonefors, Melanie Wehbe, Mikaela Samuelsson |
| 5 | Vilhelm Buchaus | Hearts don't lie | David Zandén, Isa Molin, Vilhelm Buchaus |
| 6 | Sanna Nielsen | Waste your love | Jimmy Jansson, Peter Boström, Thomas G:son |

---

## 3. Kärnkoncept

### 3.1 Sällskap (Party/Group)
Ett sällskap är en grupp vänner som tittar på Mello ihop (fysiskt eller på distans). En användare kan vara med i flera sällskap.

- **Skapa sällskap** – ange namn, få en delkod/länk
- **Gå med i sällskap** – via delkod, QR-kod, eller delningslänk
- **Sällskapsvy** – se alla medlemmar och deras röster i realtid

### 3.2 Röstning
Varje medlem röstar på bidragen i den aktuella deltävlingen. Röstningen är per deltävling och oberoende av varandra.

- **Poängsättning:** 1–10 poäng per bidrag
- **Favoritmarkering:** Välj din favorit (1 per deltävling)
- **Röstfönster:** Öppnar vid sändningsstart (20:00) och stänger t.ex. 23:59 samma kväll (konfigurerbart)
- **Ändra röst:** Tillåtet så länge röstfönstret är öppet

### 3.3 Automatisk deltävlingslogik
Appen vet alltid vilken deltävling som är aktuell baserat på dagens datum:

```
före 2026-01-31         → "Countdown till Deltävling 1"
2026-01-31              → Deltävling 1 (aktiv röstning)
2026-02-01 – 2026-02-06 → Deltävling 1 resultat / väntar på DT2
2026-02-07              → Deltävling 2 (aktiv röstning)
...osv...
2026-02-28              → Deltävling 5 + Finalkval
2026-03-07              → Finalen
efter 2026-03-07        → Säsongssammanfattning
```

---

## 4. Funktioner

### 4.1 Autentisering
- Google Sign-In (Firebase Auth)
- Valfritt: anonym inloggning med nickname (för snabb onboarding)
- Profilbild från Google eller emoji-avatar

### 4.2 Hemskärm
- **Aktuell/nästa deltävling** med countdown-timer
- **Mina sällskap** – snabbåtkomst
- **Senaste resultat** – sammanfattning från förra deltävlingen

### 4.3 Deltävlingsvy
- Lista med alla 6 bidrag (artist, låttitel, startnummer)
- Röstning inline: stjärnor eller drag-and-drop-ranking
- Live-status: "Röstningen öppen" / "Stängd" / "Resultat"
- Sällskapets samlade röster visas efter att alla röstat (eller efter deadline)

### 4.4 Sällskapsvy
- Medlemslista med avatarer
- Per deltävling: vem har röstat (utan att visa hur, tills alla röstat)
- Resultatvy: alla röster synliga, sällskapets ranking
- Chat/kommentarer (valfritt, v2)

### 4.5 Live-snittpoäng
Sällskapets snittpoäng per bidrag visas i realtid och uppdateras efterhand som medlemmar röstar. Snittet beräknas på antalet som faktiskt röstat (inte totalt antal medlemmar), vilket innebär att snittet kan gå upp och ner när nya röster kommer in.

- Visas som ett löpande snitt bredvid varje bidrag (t.ex. "7.3")
- Uppdateras live via Firestore onSnapshot
- Visuell indikator: "3 av 5 har röstat"

### 4.6 Total-topplista (alla deltävlingar)
En ackumulerad topplista som rankar alla bidrag som varit med i hela tävlingen, baserat på sällskapets snittpoäng. Listan växer för varje deltävling.

- Visar alla bidrag från avslutade deltävlingar sorterade på snittpoäng
- Snittet per bidrag = genomsnittet av alla medlemmars röster i sällskapet
- Gör det enkelt att jämföra bidrag över deltävlingar ("Var DT3-vinnaren bättre än DT1-vinnaren?")
- Uppdateras automatiskt när en ny deltävling avslutats

### 4.7 Statistik & Insikter
Per sällskap och per användare, ackumulerat över alla deltävlingar:

| Statistik | Beskrivning |
|-----------|-------------|
| Sällskapets topplistor | Sammanlagd ranking baserat på alla medlemmars röster |
| Enighet/oenighet | Hur överens är gruppen? (standardavvikelse per bidrag) |
| Personlig träffsäkerhet | Hur väl matchar dina favoriter det officiella resultatet? |
| Head-to-head | Jämför din ranking med en annan medlems |
| Trender | Vilka artister har stigit/sjunkit i popularitet mellan deltävlingar (relevant för finalkval/final) |
| Favoritfördelning | Cirkeldiagram: vem röstade på vem som favorit |

### 4.8 Finalkval & Final
- **Finalkval:** Visa de 5 bidrag som gått till finalkval, tillåt röstning
- **Final:** Visa alla 12 finalister, röstning med utökad skala (t.ex. 1–12 ranking eller 1–5 stjärnor)
- **Säsongsöversikt:** Total statistik för hela Mello-säsongen

---

## 5. Datamodell (Firestore)

```
/users/{userId}
  - displayName: string
  - photoURL: string
  - createdAt: timestamp

/parties/{partyId}
  - name: string
  - createdBy: userId
  - joinCode: string (6 tecken, unikt)
  - members: userId[]
  - createdAt: timestamp

/parties/{partyId}/votes/{eventId}
  - aggregates: {                      // uppdateras via Cloud Function eller transaction
      entryId: {
        sum: number,                   // summa av alla röster
        count: number,                 // antal som röstat
        avg: number                    // beräknat snitt
      }
    }
  /userVotes/{userId}
    - ratings: { entryId: number }     // t.ex. { "dt1-1": 8, "dt1-2": 3, ... }
    - favorite: entryId
    - votedAt: timestamp
    - updatedAt: timestamp

/events/{eventId}
  - type: "semifinal" | "finalkval" | "final"
  - number: number                     // 1-5 för deltävlingar
  - date: "2026-01-31"
  - time: "20:00"
  - city: string
  - arena: string
  - votingOpen: boolean
  - votingCloseTime: timestamp
  - entries: Entry[]

/events/{eventId}/entries/{entryId}
  - startNumber: number
  - artist: string
  - song: string
  - songwriters: string[]
  - result: "final" | "finalkval" | "eliminated" | null

/events/{eventId}/officialResults
  - toFinal: entryId[]
  - toFinalkval: entryId | null
  - eliminated: entryId[]
```

---

## 6. Automatisk Event-logik (pseudokod)

```typescript
function getCurrentEvent(events: Event[]): EventState {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Hitta aktiv event (sändningsdag)
  const activeEvent = events.find(e => e.date === today);
  if (activeEvent) {
    const showStart = new Date(`${e.date}T20:00:00+01:00`);
    if (now >= showStart) {
      return { event: activeEvent, status: 'VOTING_OPEN' };
    }
    return { event: activeEvent, status: 'TODAY_COUNTDOWN' };
  }

  // Hitta nästa kommande event
  const upcoming = events
    .filter(e => e.date > today)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (upcoming.length > 0) {
    return { event: upcoming[0], status: 'UPCOMING' };
  }

  // Alla events avslutade
  return { event: events[events.length - 1], status: 'SEASON_COMPLETE' };
}
```

---

## 7. Tech Stack

| Lager | Teknik |
|-------|--------|
| Frontend | React 19 + Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| State | Zustand eller React Context |
| Realtid | Firestore onSnapshot (live-uppdatering av röster) |
| Auth | Firebase Authentication (Google Sign-In) |
| Databas | Cloud Firestore |
| Hosting | Firebase Hosting |
| PWA | next-pwa / Workbox (manifest, service worker, offline-stöd) |
| Animationer | Framer Motion |
| Grafer/statistik | Recharts eller Chart.js |

### 7.1 PWA-krav
- `manifest.json` med app-namn, ikoner, theme_color
- Service Worker för offline-cacning av app-shell
- "Lägg till på hemskärmen"-prompt
- Responsiv design (mobile-first)
- Splash screen

---

## 8. Vyer & Navigation

```
/                     → Hemskärm (aktuell deltävling, mina sällskap)
/event/{eventId}      → Deltävlingsvy med bidrag och röstning
/party/{partyId}      → Sällskapsvy
/party/{partyId}/stats → Statistik för sällskapet
/party/join/{code}    → Gå med i sällskap via delkod
/profile              → Min profil, mina röster, personlig statistik
```

---

## 9. Röstningsflöde (UX)

```
1. Användaren öppnar appen på sändningskvällen
2. Hemskärmen visar: "🔴 Deltävling 2 – LIVE"
3. Klickar sig in → ser 6 bidrag med artist + låtnamn
4. Under/efter sändningen: betygsätter varje bidrag 1-10 poäng
5. Markerar en favorit ❤️
6. Trycker "Skicka in röst"
7. Ser "Väntar på att alla i sällskapet röstar..."
8. När alla röstat (eller deadline passerat):
   → Sällskapets samlade resultat visas
   → Statistik uppdateras
```

---

## 10. Delningsfunktion

- **Skapa sällskap** → genererar en delningslänk: `melloappen.se/party/join/ABC123`
- **Dela via:** Native Web Share API (fungerar bra på mobil)
- **QR-kod:** Genereras automatiskt för sällskapets join-länk
- **Deeplink:** PWA hanterar `/party/join/{code}` och promptar inloggning om nödvändigt

---

## 11. Offlinehantering

- App-shell cachas via Service Worker
- Bidragsdata cachas lokalt efter första laddning
- Röster sparas lokalt och synkas vid uppkoppling
- Statistik kräver online-anslutning

---

## 12. Framtida funktioner (v2+)

- **Tipping/Odds:** Gissa vinnare före sändning, poäng för rätt
- **Live-reaktioner:** Emoji-reaktioner i realtid under sändning
- **Integration med Spotify:** Länk till låtarna på Spotify
- **Publika sällskap:** Gå med i öppna sällskap med okända
- **Push-notiser:** Påminnelse 30 min före sändning, "alla har röstat"
- **Eurovision-stöd:** Utöka till ESC med samma koncept
- **Historik:** Spara data från tidigare år

---

## 13. Säkerhet & Regler

- En röst per användare per deltävling per sällskap
- Röster kan inte ändras efter att röstfönstret stängt
- Join-koder löper inte ut (men kan återskapas av sällskapets admin)
- Firestore Security Rules: användare kan bara läsa/skriva sin egen röstdata
- Rate limiting på sällskapsskapande (förhindra spam)

---

## 14. MVP-scope (v1)

Minimum viable product för att vara redo till Deltävling 1:

1. ✅ Google-inloggning
2. ✅ Skapa & gå med i sällskap (delkod)
3. ✅ Se aktuell deltävling med alla bidrag
4. ✅ Rösta 1-10 poäng per bidrag
5. ✅ Se sällskapets samlade resultat
6. ✅ Grundläggande statistik (sällskapets topplista, enighetsindex)
7. ✅ PWA-installationsbar
8. ✅ Automatisk deltävlingslogik

---

*Senast uppdaterad: 2026-02-07*
