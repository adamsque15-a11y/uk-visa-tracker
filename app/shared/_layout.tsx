import { Stack } from 'expo-router';

// Read-only, no-login-required summary pages (Checklist/Cost Calculator
// share links) — see app/_layout.tsx's inSharedGroup exemption.
export default function SharedLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
