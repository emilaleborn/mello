import type { MelloEvent, EventState, EventStatus } from '@/types';

/**
 * Determine the current event state based on the current time.
 *
 * Statuses:
 * - UPCOMING: before the event day
 * - TODAY_COUNTDOWN: event day but before show start time
 * - VOTING_OPEN: show has started, voting open until 23:59
 * - VOTING_CLOSED: after 23:59 on event day but before results (same night)
 * - RESULTS: after voting closes and before next event
 * - SEASON_COMPLETE: after all events are done
 *
 * Special: Feb 28 has both DT5 (20:00) and Finalkval (21:30).
 */
export function getCurrentEvent(
  events: MelloEvent[],
  now: Date = new Date(),
): EventState {
  const sorted = [...events].sort((a, b) => {
    const cmp = a.date.localeCompare(b.date);
    if (cmp !== 0) return cmp;
    return a.time.localeCompare(b.time);
  });

  const today = formatDate(now);

  // Find events happening today
  const todayEvents = sorted.filter((e) => e.date === today);

  if (todayEvents.length > 0) {
    // For days with multiple events (Feb 28: DT5 + Finalkval), pick the relevant one
    // Go in reverse to find the latest show that has started, or the next upcoming one
    for (let i = todayEvents.length - 1; i >= 0; i--) {
      const e = todayEvents[i];
      const showStart = parseEventDateTime(e);
      const votingEnd = getVotingEndTime(e);

      if (now >= votingEnd) {
        // This event's voting is closed
        continue;
      }

      if (now >= showStart) {
        return { event: e, status: 'VOTING_OPEN' };
      }

      // Before this show's start — countdown
      return { event: e, status: 'TODAY_COUNTDOWN' };
    }

    // All today events have closed voting — check if we're still before midnight
    const lastToday = todayEvents[todayEvents.length - 1];
    const lastVotingEnd = getVotingEndTime(lastToday);
    if (now >= lastVotingEnd) {
      // After last voting window closed today — show RESULTS for the last event today
      return { event: lastToday, status: 'RESULTS' };
    }
  }

  // Not on an event day — find the most recent past event or next upcoming one
  const pastEvents = sorted.filter((e) => e.date < today);
  const futureEvents = sorted.filter((e) => e.date > today);

  if (futureEvents.length > 0) {
    // There's a future event — check if we're in a "RESULTS" window after a past event
    if (pastEvents.length > 0) {
      const lastPast = pastEvents[pastEvents.length - 1];
      return { event: lastPast, status: 'RESULTS' };
    }
    // No past events yet — pure upcoming
    return { event: futureEvents[0], status: 'UPCOMING' };
  }

  // No future events left
  if (pastEvents.length > 0) {
    const lastEvent = pastEvents[pastEvents.length - 1];
    // Check if we're still on the last event day (after voting closed)
    if (lastEvent.date === today) {
      return { event: lastEvent, status: 'RESULTS' };
    }
    return { event: lastEvent, status: 'SEASON_COMPLETE' };
  }

  // Fallback (should not happen with valid data)
  return { event: sorted[0], status: 'UPCOMING' };
}

export function parseEventDateTime(event: MelloEvent): Date {
  const [hours, minutes] = event.time.split(':').map(Number);
  const [year, month, day] = event.date.split('-').map(Number);
  const d = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return d;
}

export function getVotingEndTime(event: MelloEvent): Date {
  const [year, month, day] = event.date.split('-').map(Number);
  return new Date(year, month - 1, day, 23, 59, 0, 0);
}

function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getStatusLabel(status: EventStatus): string {
  switch (status) {
    case 'UPCOMING':
      return 'Coming up';
    case 'TODAY_COUNTDOWN':
      return 'Today!';
    case 'VOTING_OPEN':
      return 'Voting open';
    case 'VOTING_CLOSED':
      return 'Voting closed';
    case 'RESULTS':
      return 'Results';
    case 'SEASON_COMPLETE':
      return 'Season complete';
  }
}
