---
name: Improve Test Coverage
description: On a daily schedule, analyze test coverage gaps and add missing unit tests for recently changed code.
---

# Improve Test Coverage

## Context

This project uses Jest with jsdom and collects coverage in json/lcov/text formats (see `jest.config.js`). The codebase has custom hooks, utility functions, Redux store slices, and React components — all prime candidates for unit testing. CI runs tests on every build. However, recently changed files in `src/hooks/`, `src/utils/`, and `src/store/` often lack corresponding test updates. This check runs on a daily schedule to surface coverage gaps for code changed in the last 7 days.

## What to Check

### 1. Hooks Without Tests

Every custom hook in `src/hooks/` should have a corresponding test in `src/hooks/__tests__/` or a colocated `.test.ts` file. Flag hooks that have been modified in the last 7 days but have no test file.

BAD:
```
src/hooks/useMarketData.ts        ← modified 3 days ago
src/hooks/__tests__/              ← no useMarketData.test.ts
```

GOOD:
```
src/hooks/useMarketData.ts
src/hooks/__tests__/useMarketData.test.ts
```

### 2. Utility Functions Without Coverage

Pure utility functions in `src/utils/` are the highest-value test targets. Flag any utility file modified recently with no associated test file.

BAD:
```tsx
// src/utils/formatAmount.ts — modified, no test
export const formatAmount = (value: BigInt, decimals: number): string => { ... }
// zero tests for edge cases: zero value, max uint256, negative decimals
```

GOOD:
```tsx
// src/utils/__tests__/formatAmount.test.ts
describe('formatAmount', () => {
  it('formats zero correctly', () => expect(formatAmount(0n, 18)).toBe('0.0'));
  it('handles max uint256', () => { ... });
  it('throws on negative decimals', () => { ... });
});
```

### 3. Store Slices Without Reducer Tests

Redux store slices in `src/store/` should have tests for each reducer action and selector. Flag slices changed recently without corresponding test coverage.

BAD:
```
src/store/slices/marketSlice.ts   ← reducer actions untested
```

GOOD:
```tsx
describe('marketSlice', () => {
  it('sets market data on fetchMarkets.fulfilled', () => { ... });
  it('sets error on fetchMarkets.rejected', () => { ... });
});
```

## Key Files to Check

- `src/hooks/**/*.ts` (recently modified)
- `src/utils/**/*.ts` (recently modified)
- `src/store/**/*.ts` (recently modified)
- `jest.config.js` for coverage thresholds

## Exclusions

- `src/stories/` — Storybook stories are not unit tests
- `src/pages/` — integration/e2e tests are more appropriate
- Auto-generated files and type-only files
- Files modified only for minor copy or styling changes
