---
name: Anti-Slop
description: When a PR is opened, clean up AI-generated code patterns like unnecessary comments and verbose naming.
---

# Anti-Slop

## Context

AI-assisted development is common in this codebase (Next.js/TypeScript/React). AI tools frequently introduce verbose, redundant, or low-signal patterns that degrade code readability without adding value: obvious inline comments, over-qualified variable names, redundant type annotations where inference is sufficient, and boilerplate JSDoc on trivial functions. These patterns are not caught by ESLint or TypeScript strict mode.

## What to Check

### 1. Unnecessary Inline Comments

Flag comments that merely restate what the code already expresses clearly.

BAD:
```tsx
// Set loading to true
setLoading(true);

// Map over items and return JSX
return items.map((item) => <Item key={item.id} data={item} />);

// Check if user is authenticated
if (!user) return null;
```

GOOD:
```tsx
setLoading(true);
return items.map((item) => <Item key={item.id} data={item} />);
if (!user) return null;
```

### 2. Verbose / Over-Qualified Naming

Flag variable or function names that pad length without adding clarity.

BAD:
```tsx
const handleButtonClickEvent = () => { ... };
const userDataObject = useUserData();
const isLoadingStateActive = useLoading();
```

GOOD:
```tsx
const handleClick = () => { ... };
const user = useUserData();
const isLoading = useLoading();
```

### 3. Redundant Type Annotations

Flag explicit type annotations where TypeScript can infer the type trivially.

BAD:
```tsx
const count: number = 0;
const label: string = 'Submit';
const items: Array<string> = [];
```

GOOD:
```tsx
const count = 0;
const label = 'Submit';
const items: string[] = []; // only annotate when inference would be `never[]`
```

### 4. Boilerplate JSDoc on Trivial Functions

Flag JSDoc blocks on functions whose signature is already self-documenting.

BAD:
```tsx
/**
 * Returns the user's name.
 * @param user - The user object.
 * @returns The user's name string.
 */
const getUserName = (user: User): string => user.name;
```

GOOD:
```tsx
const getUserName = (user: User) => user.name;
```

## Key Files to Check

- `src/components/**/*.tsx`
- `src/hooks/**/*.ts`
- `src/utils/**/*.ts`
- `src/store/**/*.ts`

## Exclusions

- Public API functions exported from library boundaries (JSDoc is appropriate)
- Comments explaining non-obvious business logic, math, or protocol-specific behaviour
- Type annotations required to satisfy strict ESLint rules or complex generics
