# AGENTS.md — AI Agent Instructions

> Compatible with: GitHub Copilot, Claude, Gemini, Cursor IDE, Windsurf, and other AI coding agents.

## Session Management

- **Always** create a to-do list at the start of each multi-step task.
- Maintain a temporary log file (`copilot_session.log`) during the session; do **not** commit it.

## Project Overview

**Training Currency Converter** — a Next.js 14 app that converts currencies using real-time exchange rates. Built with TypeScript and Tailwind CSS. Tests use Jest + React Testing Library.

```
app/
  api/rates/route.ts   ← exchange-rate API with multi-source fallback
  page.tsx             ← root page (client component)
components/            ← small, focused UI components (co-located tests)
hooks/
  useExchangeRates.ts  ← fetches /api/rates
  useConverter.ts      ← conversion logic + URL sync
types/index.ts
utils/
  currency.ts          ← formatting, validation, conversion math
  storage.ts           ← localStorage history helpers
```

## Core Architecture

### Custom Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useExchangeRates` | `hooks/useExchangeRates.ts` | Fetches `/api/rates`; returns `{ exchangeRates, loading, error }` |
| `useConverter` | `hooks/useConverter.ts` | Conversion logic, URL state sync, localStorage history |

### Component Composition

Components are **small and focused**. `ConverterForm` composes `AmountInput`, `CurrencySelect`, `SwapButton`, and `ConversionResult`. The page assembles them with hooks.

### State Management — URL-First

Persist `amount`, `from`, and `to` in the URL query string using `useSearchParams` and `router.push`. Initialize component state from URL params; update URL after every successful conversion.

### API Layer — Multiple Fallback Sources

`app/api/rates/route.ts` tries each source in order; falls back to the next on error:

1. `https://api.frankfurter.app/latest?from=USD`
2. `https://open.er-api.com/v6/latest/USD`
3. `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`
4. Static `MOCK_RATES` (last resort — never breaks the UI)

Cache header: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200` (1-hour cache).

## Critical Patterns

### 1 — Co-located Tests

Every `.tsx` / `.ts` implementation file must have a sibling `.test.tsx` / `.test.ts` file:

```
components/CurrencySelect.tsx   →  components/CurrencySelect.test.tsx
hooks/useConverter.ts           →  hooks/useConverter.test.ts
utils/currency.ts               →  utils/currency.test.ts
```

Run tests: `npm test`

### 2 — URL State Management

```ts
// Read initial state from URL on mount
const urlAmount = searchParams.get('amount');
if (urlAmount) setAmount(urlAmount);

// Persist state to URL after conversion
router.push(`?amount=${amt}&from=${from}&to=${to}`, { scroll: false });
```

### 3 — API Error Handling with Fallbacks

```ts
for (const source of API_SOURCES) {
  try {
    return await fetchFromSource(source);
  } catch (error) {
    // log and continue to next source
  }
}
// All external sources failed — return static mock data
return MOCK_RATES;
```

## Development Commands

```bash
npm run dev          # start development server
npm test             # run all tests
npm run test:watch   # tests in watch mode
npm run test:ci      # CI mode with coverage
npm run build        # production build
npm run lint         # ESLint
```
