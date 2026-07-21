// DEV ONLY: lets you bypass Supabase during local development before a real
// project is wired up. Remove this file and its usages before shipping.

export const TEST_ACCOUNT = { email: 'test@example.com', password: 'test1234' };

type Listener = (active: boolean) => void;

let mockSessionActive = false;
const listeners = new Set<Listener>();

export function isMockSessionActive() {
  return mockSessionActive;
}

export function setMockSession(active: boolean) {
  mockSessionActive = active;
  listeners.forEach((listener) => listener(active));
}

export function subscribeMockSession(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
