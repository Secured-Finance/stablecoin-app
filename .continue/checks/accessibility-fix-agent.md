---
name: Accessibility Fix Agent
description: When a PR is opened, scan for accessibility violations and suggest detailed remediation steps for each.
---

# Accessibility Fix Agent

## Context

This project uses `eslint-plugin-jsx-a11y` which catches basic static accessibility issues (missing `alt`, `role` on interactive elements). However, many a11y issues require runtime context or semantic understanding that static analysis cannot detect: logical heading hierarchy, keyboard navigation order, ARIA live region usage, colour contrast in dynamic themes, and focus management after async state changes. PR reviews have not historically flagged these, making this a high-value AI check.

The app is a DeFi stablecoin interface — users may rely on assistive technology to navigate complex financial data tables, modals, and form flows.

## What to Check

### 1. Heading Hierarchy

Heading levels must not skip (e.g. h1 → h3). Each page should have exactly one `<h1>`. Check `src/pages/` and major layout components.

BAD:
```tsx
<h1>Market Overview</h1>
<h3>Active Positions</h3>  {/* skipped h2 */}
```

GOOD:
```tsx
<h1>Market Overview</h1>
<h2>Active Positions</h2>
<h3>USD Coin Details</h3>
```

### 2. Interactive Elements Without Keyboard Access

All clickable `<div>`, `<span>`, or custom elements must have `role`, `tabIndex={0}`, and `onKeyDown`/`onKeyUp` handlers. `eslint-plugin-jsx-a11y` catches `onClick` without `role` but not missing keyboard event handlers on elements that already have a role.

BAD:
```tsx
<div role="button" onClick={handleSelect}>
  Select Asset
</div>
```

GOOD:
```tsx
<div
  role="button"
  tabIndex={0}
  onClick={handleSelect}
  onKeyDown={(e) => e.key === 'Enter' && handleSelect()}
>
  Select Asset
</div>
```

### 3. ARIA Labels on Icon-Only Buttons

Buttons that contain only an icon (SVG or image) with no visible text must have `aria-label` describing the action — not the icon.

BAD:
```tsx
<button onClick={onClose}>
  <CloseIcon />
</button>
```

GOOD:
```tsx
<button aria-label="Close dialog" onClick={onClose}>
  <CloseIcon aria-hidden="true" />
</button>
```

### 4. Focus Management After Async Actions

After a modal opens, focus must move into the modal. After a modal closes, focus must return to the trigger element. After form submission or async data load, focus should not be lost.

BAD:
```tsx
const [open, setOpen] = useState(false);
// Modal opens but focus stays on page behind it
<Modal isOpen={open}><Form /></Modal>
```

GOOD:
```tsx
// Modal uses autoFocus on first interactive element, or useFocusTrap
<Modal isOpen={open} onClose={() => { setOpen(false); triggerRef.current?.focus(); }}>
  <Form />
</Modal>
```

### 5. Data Tables with Missing Semantic Markup

Financial data tables must use `<table>`, `<th scope="col">`, `<caption>`, and `<td>` — not generic divs. Screen readers rely on table semantics to navigate large data sets.

BAD:
```tsx
<div className="table">
  <div className="row header"><div>Asset</div><div>Balance</div></div>
  <div className="row"><div>USDC</div><div>1,000</div></div>
</div>
```

GOOD:
```tsx
<table>
  <caption>Your Asset Balances</caption>
  <thead><tr><th scope="col">Asset</th><th scope="col">Balance</th></tr></thead>
  <tbody><tr><td>USDC</td><td>1,000</td></tr></tbody>
</table>
```

## Key Files to Check

- `src/components/**/*.tsx`
- `src/pages/**/*.tsx`
- Any component containing modal, dialog, drawer, or table patterns

## Exclusions

- `src/stories/` Storybook files
- Auto-generated or third-party embedded components
- `eslint-plugin-jsx-a11y` already enforces: missing `alt`, `role` on `<a>` with no href, `aria-*` typos
