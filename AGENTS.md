# Agent Instructions

Guidelines for AI coding agents (Claude, Gemini, Cursor IDE, Windsurf, GitHub Copilot, etc.) working in this Next.js currency converter repository.

---

## Session Management

- **Always** create a to-do list at the start of each multi-step task
- Maintain a temporary log file (`copilot_session.log`) for context recovery after interruptions
- Commit after each meaningful change
- Review `git diff` before committing

---

## Repository Overview

A Next.js 14 currency converter application featuring:
- Real-time exchange rates via a server-side API route with caching
- URL-driven state (shareable, bookmarkable conversions)
- Conversion history stored in `localStorage`
- Fully typed with TypeScript and styled with Tailwind CSS

### Key Directories

```
app/                   # Next.js App Router pages and API routes
components/            # Small, focused UI components
hooks/                 # Custom React hooks
types/                 # Shared TypeScript types
utils/                 # Pure utility functions
docs/                  # Challenge guides and reference docs
```

---

## Core Architecture

### Custom Hooks

| Hook | Location | Purpose |
|------|----------|---------|
| `useExchangeRates` | `hooks/useExchangeRates.ts` | Fetches rates from `/api/rates`; returns `{ exchangeRates, loading, error }` |
| `useConverter` | `hooks/useConverter.ts` | Handles conversion logic, URL state sync, and localStorage history |

Re-exported from `hooks/index.ts`.

### Component Composition — Small, Focused Components

```
ConverterForm       → AmountInput + CurrencySelect + SwapButton + ConversionResult
ConversionHistory   → list of past conversions (collapsible)
ErrorMessage        → inline error display
LoadingSpinner      → loading state
PageHeader          → title / subtitle
PageFooter          → last-updated timestamp
```

### State Management — URL-First with `useSearchParams`

State flows: **URL query params → React state → re-render**.

```
/?amount=100&from=USD&to=EUR
        ↓
  useConverter reads searchParams on mount
        ↓
  user changes a field → router.push updates URL (scroll: false)
        ↓
  URL is always in sync → shareable links
```

### API Layer — Multiple Fallback Sources with 1-Hour Caching

`app/api/rates/route.ts`:

1. Iterates `API_SOURCES` array in order, returning on first success
2. Falls back to hard-coded `MOCK_RATES` when all remote sources fail
3. Sets `Cache-Control: public, s-maxage=3600` and Next.js `revalidate = 3600`

To add a new data source, append `{ name, url, transform }` to `API_SOURCES`.

---

## Critical Patterns

### Co-Located Tests

Every component or hook has a sibling test file:

```
components/AmountInput.tsx         → components/AmountInput.test.tsx
components/ConverterForm.tsx       → components/ConverterForm.test.tsx
hooks/useConverter.ts              → hooks/useConverter.test.ts
app/api/rates/route.ts             → app/api/rates/route.test.ts
```

Test stack: **Jest + Testing Library** (jsdom environment).

```bash
npm test                           # watch mode
npm test -- --watchAll=false       # single CI run
```

### URL State Management Pattern

```typescript
// Read on mount
const searchParams = useSearchParams();
if (searchParams.get('amount')) setAmount(searchParams.get('amount')!);

// Write on change
router.push(`?amount=${amt}&from=${from}&to=${to}`, { scroll: false });
```

### API Error Handling with Fallbacks

```typescript
for (const source of API_SOURCES) {
  try {
    return await fetchFromSource(source);
  } catch {
    // try next source
  }
}
return MOCK_RATES;  // guaranteed non-null response
```

---

## Coding Conventions

- **TypeScript strict mode** — type all props, hook returns, and function signatures
- **Tailwind CSS** — no inline styles; use utility classes
- **React functional components** only
- **`useCallback`/`useEffect` deps** must be complete and correct
- **Side-effects belong in hooks**, not components
- **Tests co-located** with source files (`.test.tsx` / `.test.ts`)
