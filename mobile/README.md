# Manjunatha Residency — mobile app

Expo (React Native) app for the owner, managers and tenants of Manjunatha
Residency. Screens follow the design canvas:
https://claude.ai/artifact/TEs1m3UTkBzdZ2J59c48wf

## Architecture (MVC)

```
app/                    Routes (Expo Router) — thin: each screen just wires
                         a controller hook to a view component.
src/
  models/                Model — Supabase reads/writes and their types.
                         No React here.
  controllers/           Controller — one hook per screen: local state +
                         TanStack Query, calling into models, returning
                         data/handlers for the view.
  views/                 View — presentational components, one per screen,
                         built from the mockups. No data fetching.
  components/            Shared dumb UI (Card, Chip, Button, Icon, tab bar…)
  lib/                   Cross-cutting: Supabase client, query client,
                         number/date formatting, navigation helpers.
  constants/             Design tokens (theme.ts) and icon path data.
  types/                 Generated Supabase database types.
```

## Setup

```bash
cd mobile
npm install
cp .env.example .env   # already points at the project's URL + anon key
npx expo start
```

Scan the QR code with Expo Go, or `npm run android` with an emulator/device
connected. `npm run typecheck` runs `tsc --noEmit`.

## Sign-in

Email + a 6-digit code (Supabase's built-in email OTP — no SMS provider
needed). After verifying, `app/index.tsx` sends the person to the right
screens based on `profiles.role` and whether a tenant has a current tenancy.

Make the first owner once, in the Supabase SQL editor:

```sql
update public.profiles set role = 'owner' where id = '<your-user-id>';
```

## Regenerating database types

After any migration under `supabase/migrations/`, regenerate
`src/types/database.ts` from the Supabase project (id `bsjzvstnbdtnpbanbsan`)
and re-add the `Relationships: [...]` array on each table/view — supabase-js
requires it for `.insert()`/`.update()` calls to type-check.

## Known simplifications (not in the original mockups)

- **Sign-in is email OTP**, not phone OTP as first drawn — mobile OTP needs a
  paid SMS provider; email is free via Supabase.
- **Profile / sign-out screens** (tenant tab, and nowhere yet for staff) —
  added because a real app needs a way to sign out.
- **UPI ID is a placeholder** (`[OWNER UPI ID]`) — the schema has no column
  for it yet; decide whether it's one ID for both blocks or one per block,
  then add the column.
- **"More" (staff tab)** goes straight to Expenses for now; the plan board
  earmarks applications, tenants and settings there too.
- **Move-in / move-out are simplified**: move-out ends the tenancy today and
  refunds the full deposit; adjust the refund from the tenancy record if
  needed. Move-in can prefill from a pending application, including its
  applicant's account, so they keep tenant access after moving in.
