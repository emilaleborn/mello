'use client';

import { useState, useEffect } from 'react';
import type { EventState } from '@/types';
import { MELLO_EVENTS } from '@/constants/events';
import { getCurrentEvent } from '@/lib/utils/eventLogic';

export function useCurrentEvent(): EventState | null {
  const [state, setState] = useState<EventState | null>(() =>
    getCurrentEvent(MELLO_EVENTS),
  );

  useEffect(() => {
    // Re-evaluate every 30 seconds
    const interval = setInterval(() => {
      setState(getCurrentEvent(MELLO_EVENTS));
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  return state;
}
