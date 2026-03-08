# GitHub Copilot Instructions

Project-specific guidance for AI-assisted development in this Next.js currency converter.

---

## Session Management

- Always create a to-do list at the start of each multi-step task
- Maintain a temporary log file (`copilot_session.log`) for context recovery after interruptions
- Split large files into labelled blocks (~200 lines each: `[Block 1/5]`)
- Commit after each significant change; use `git diff` to review before committing

---

## Core Architecture

### Custom Hooks

| Hook | File | Responsibility |
|------|------|----------------|
| `useExchangeRates` | `hooks/useExchangeRates.ts` | Fetch rates from `/api/rates`, expose `{ exchangeRates, loading, error }` |
| `useConverter` | `hooks/useConverter.ts` | Conversion logic, URL sync via `useSearchParams`, history via `localStorage` |

Both hooks are re-exported from `hooks/index.ts`.

### Component Composition

Components live in `components/` and are small and focused:

- `ConverterForm` — amount input + currency selects + swap button + result display
- `AmountInput` — controlled number input with validation feedback
- `CurrencySelect` — dropdown for selecting a currency code
- `SwapButton` — button that swaps from/to currencies
- `ConversionResult` — displays the converted amount and rate
- `ConversionHistory` — collapsible list of past conversions
- `ErrorMessage` — inline error display
- `LoadingSpinner` — loading indicator
- `PageHeader` / `PageFooter` — layout wrappers

### State Management — URL-First with `useSearchParams`

State flows: **URL params → React state → re-render**.

```
/?amount=100&from=USD&to=EUR
        ↓
  useConverter reads searchParams on mount
        ↓
  user changes → router.push updates URL
        ↓
  shareable, bookmarkable links
```

The `updateURL` helper inside `useConverter` calls `router.push` with `scroll: false` to keep the page position stable.

### API Layer — Multiple Fallback Sources with 1-Hour Caching

`app/api/rates/route.ts` implements:

1. **Primary source**: `frankfurter.app` (no API key required)
2. **Fallback**: additional sources can be added to the `API_SOURCES` array
3. **Last-resort fallback**: hard-coded `MOCK_RATES` (used when all remote sources fail)
4. **Caching**: `Cache-Control: public, s-maxage=3600` + Next.js `revalidate = 3600`

To add a new API source, append an object to `API_SOURCES` with `{ name, url, transform }`.

---

## Critical Patterns

### Co-Located Tests

Every component or hook file has a sibling `.test.tsx` / `.test.ts` file:

```
components/
  AmountInput.tsx
  AmountInput.test.tsx
  ConverterForm.tsx
  ConverterForm.test.tsx
hooks/
  useConverter.ts
  useConverter.test.ts
app/api/rates/
  route.ts
  route.test.ts
```

Run tests with:

```bash
npm test               # all tests (watch mode)
npm test -- --watchAll=false   # single run (CI)
```

### URL State Management Pattern

```typescript
// Read from URL on mount
const searchParams = useSearchParams();
const urlAmount = searchParams.get('amount');
if (urlAmount) setAmount(urlAmount);

// Write back to URL on change
const router = useRouter();
router.push(`?amount=${amt}&from=${from}&to=${to}`, { scroll: false });
```

### API Error Handling with Fallbacks

```typescript
for (const source of API_SOURCES) {
  try {
    return await fetchFromSource(source);   // try primary
  } catch {
    // continue to next source
  }
}
// all sources failed — use MOCK_RATES
return MOCK_RATES;
```

Always return a successful response to the client; wrap errors in `{ success: false, error: '...' }` with HTTP 500 only for unexpected handler failures.

---

## Project Structure

```
app/
  page.tsx              # main page — composes hooks + components
  layout.tsx
  globals.css
  api/rates/
    route.ts            # exchange rate API with caching + fallback
    route.test.ts
components/             # small, focused UI components (each with .test.tsx)
hooks/
  useExchangeRates.ts   # data-fetching hook
  useConverter.ts       # conversion + URL state hook
  index.ts              # re-exports
types/                  # shared TypeScript interfaces
utils/
  currency.ts           # conversion math + currency list
  storage.ts            # localStorage helpers
```

---

## TypeScript & Style Conventions

- Strict TypeScript — always type props, hook return values, and function parameters
- Functional components with `React.FC` or explicit prop types
- Tailwind CSS for styling — no inline styles
- `useCallback` and `useEffect` dependency arrays must be complete
- Keep components pure — side-effects belong in hooks
