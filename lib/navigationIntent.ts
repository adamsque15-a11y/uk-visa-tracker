// Remembers what the user wanted to do from the Home screen (apply vs.
// track) across the sign-in/sign-up flow, so the root layout can send them
// straight to the right place after authenticating instead of always
// landing on the Dashboard.

import { CEFRLevel } from './englishPrep/level';

export type NavigationIntent = 'apply' | 'track' | 'ielts_a1_test' | null;

let pendingIntent: NavigationIntent = null;
// Only meaningful when pendingIntent is 'ielts_a1_test' — which level button
// the user picked on Home, so the post-auth redirect lands on the same
// level they chose rather than always defaulting back to A1.
let pendingLevel: CEFRLevel | null = null;

export function setPendingIntent(intent: NavigationIntent, level?: CEFRLevel) {
  pendingIntent = intent;
  pendingLevel = level ?? null;
}

export function consumePendingIntent(): { intent: NavigationIntent; level: CEFRLevel | null } {
  const intent = pendingIntent;
  const level = pendingLevel;
  pendingIntent = null;
  pendingLevel = null;
  return { intent, level };
}
