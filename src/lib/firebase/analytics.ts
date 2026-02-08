import { logEvent } from 'firebase/analytics';
import { analytics } from './config';

export async function trackEvent(event: string, params?: Record<string, string | number>) {
  const a = await analytics;
  if (a) logEvent(a, event, params);
}
