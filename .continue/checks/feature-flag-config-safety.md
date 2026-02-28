---
name: Feature Flag & Config Type Safety
description: Catch hardcoded feature toggles that should be environment-driven and untyped config object extensions.
---

# Feature Flag & Config Type Safety

## Context

PR reviews on Secured-Finance/stablecoin-app have flagged that feature gating is sometimes implemented as hardcoded booleans instead of environment variable reads. Reviewers have also flagged `any`-typed config extensions in `src/configs/bridge.ts` and similar files. TypeScript strict mode catches some of these but not the architectural pattern of hardcoding flags. This check focuses on the judgment call: is this toggle env-driven and safely typed?

## What to Check

### 1. Hardcoded Feature Flags

Feature toggles must read from `process.env` or a centralised feature-flag constant (e.g. `src/constants/`). A boolean literal used as a gate is always a red flag.

BAD:
```tsx
// src/components/BridgeWidget.tsx
const BRIDGE_ENABLED = true; // hardcoded
if (BRIDGE_ENABLED) {
  return <BridgeWidget />;
}
```

GOOD:
```tsx
// src/constants/features.ts
export const BRIDGE_ENABLED = process.env.NEXT_PUBLIC_BRIDGE_ENABLED === 'true';

// src/components/BridgeWidget.tsx
import { BRIDGE_ENABLED } from '@/constants/features';
if (BRIDGE_ENABLED) {
  return <BridgeWidget />;
}
```

### 2. Untyped Config Extensions

Config objects in `src/configs/` must be fully typed. Using `as any`, implicit `any`, or spreading unknown objects into typed configs defeats TypeScript's guarantees.

BAD:
```tsx
// src/configs/bridge.ts
const bridgeConfig = {
  ...baseConfig,
  extraOptions: someExternalData as any,
};
```

GOOD:
```tsx
// src/configs/bridge.ts
interface BridgeConfig extends BaseConfig {
  extraOptions: ExtraOptionsType;
}
const bridgeConfig: BridgeConfig = {
  ...baseConfig,
  extraOptions: validateExtraOptions(someExternalData),
};
```

### 3. Missing NEXT_PUBLIC_ Prefix on Client-Side Env Vars

Next.js only exposes env vars to the browser when prefixed `NEXT_PUBLIC_`. Flag any `process.env.VAR` (without the prefix) used inside a React component or client-side hook.

BAD:
```tsx
// src/hooks/useConfig.ts  (client-side hook)
const apiUrl = process.env.API_URL; // won't be defined in browser
```

GOOD:
```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Key Files to Check

- `src/configs/bridge.ts`
- `src/configs/*.ts`
- `src/constants/`
- `src/hooks/**/*.ts`
- `src/components/**/*.tsx`

## Exclusions

- Server-side API routes (`src/pages/api/`) where non-prefixed env vars are intentional
- Test files where `process.env` is mocked
- Storybook story files
