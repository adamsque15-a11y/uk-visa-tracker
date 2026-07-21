# UK Visa Tracker — Phase 1 (MVP)

React Native app (Expo) + Supabase backend. Covers:

1. Auth (email works; Google/Apple are stubbed)
2. Visa questionnaire → route detection
3. Personalised checklist
4. Timeline tracker
5. Working day calculator
6. Cost calculator

Document upload / AI review is intentionally excluded from this phase.

---

## Setup status

Project scaffolding, dependencies, and source files are already in place. What's left:

## 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. In the SQL editor, run the schema in `lib/schema.sql`
3. (Optional, later) Enable Google/Apple auth providers under Authentication → Providers — only Email is wired up for now
4. Copy your Project URL and anon key into a `.env` file at the project root:

```
EXPO_PUBLIC_SUPABASE_URL=your-url-here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 2. Run it

```bash
npx expo start
```

Scan the QR code with the Expo Go app (iOS/Android) to preview on your own phone.

---

## What's included vs. stubbed

| Feature | Status |
|---|---|
| Auth | Wired to Supabase (email), needs your project keys |
| Questionnaire → route detection | Full logic, 4 visa types |
| Checklist generation | Full rule-based logic |
| Timeline tracker | Full logic + progress calculation |
| Working day calculator | Full logic, UK bank holidays included |
| Cost calculator | Full logic, editable fee constants |
| Notifications | Stubbed — needs `expo-notifications` + a scheduled job, noted in code comments |
| AI assistant | Not included this phase (flagged as needing OISC/legal review before building) |

## Regulatory note

Keep the checklist and calculators framed as general information, not personalised legal advice. Worth a quick read of OISC guidance (or a solicitor) before public launch, especially if you add the AI assistant later.
