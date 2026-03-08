# GitHub Copilot Instructions

## Session Management

- Always create a to-do list at the start of each multi-step task
- Maintain a temporary log file (`copilot_session.log`) during development sessions

## Core Architecture

This is a **Next.js 14** currency converter with the following architecture:

### Custom Hooks

- **`useExchangeRates`** (`hooks/useExchangeRates.ts`): Fetches rates from `/api/rates`, exposes `{ exchangeRates, loading, error }`
- **`useConverter`** (`hooks/useConverter.ts`): Handles conversion logic, URL sync via `useSearchParams`, and history; exposes amount, currencies, result, validation, history, and handlers

### Component Composition

Small, focused components in `components/`:

- `PageHeader` / `PageFooter` — layout chrome
- `ConverterForm` — composes `AmountInput`, `CurrencySelect`, `SwapButton`, `ConversionResult`
- `ConversionHistory` — lists past conversions from localStorage
- `ErrorMessage` / `LoadingSpinner` — feedback primitives

### State Management — URL-First

Use `useSearchParams` + `router.push` to persist `amount`, `from`, and `to` in the URL query string. Always read initial state from URL params; write back on every successful conversion.

### API Layer

`app/api/rates/route.ts` fetches from **multiple free sources in priority order** and falls back to the next on any error:

1. `frankfurter.app`
2. `open.er-api.com`
3. `cdn.jsdelivr.net/npm/@fawazahmed0`

Final fallback: static `MOCK_RATES` so the UI is never broken.

Responses are cached for **1 hour** via `Cache-Control: public, s-maxage=3600` and `export const revalidate = 3600`.

## Critical Patterns

### Co-located Tests

Every component and hook has a sibling test file:

```
components/AmountInput.tsx          ← implementation
components/AmountInput.test.tsx     ← co-located test
hooks/useConverter.ts
hooks/useConverter.test.ts
```

Use `@testing-library/react` + `jest-axe` for components; `renderHook` for hooks.

### URL State Management Pattern

```ts
// Read on mount
const urlAmount = searchParams.get('amount');
if (urlAmount) setAmount(urlAmount);

// Write after conversion
router.push(`?amount=${amt}&from=${from}&to=${to}`, { scroll: false });
```

### API Error Handling with Fallbacks

```ts
for (const source of API_SOURCES) {
  try {
    return await fetchFromSource(source); // return on first success
  } catch {
    // log and try next source
  }
}
return MOCK_RATES; // static fallback when all sources fail
```
