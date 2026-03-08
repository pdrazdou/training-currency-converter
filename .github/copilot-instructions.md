# Copilot Instructions for Currency Converter

## Project Overview

**Currency Converter** is a modern, responsive currency conversion application built with Next.js 14, TypeScript, and Tailwind CSS. This is a training project for learning AI-assisted development patterns with GitHub Copilot.

### Key Technologies
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library + MSW (Mock Service Worker)
- **APIs**: exchangerate.host, exchangerate-api.com, open.er-api.com

## Project Structure

```
app/                    # Next.js app directory
  page.tsx             # Main converter page
  layout.tsx           # Root layout
  api/rates/route.ts   # Exchange rates API endpoint
  
components/            # React components
  ConverterForm.tsx    # Main form component
  CurrencySelect.tsx   # Currency dropdown
  AmountInput.tsx      # Amount input field
  ConversionResult.tsx # Result display
  ConversionHistory.tsx # History panel
  SwapButton.tsx       # Currency swap button
  ErrorMessage.tsx     # Error display
  LoadingSpinner.tsx   # Loading state
  PageHeader.tsx       # Header component
  PageFooter.tsx       # Footer component
  
hooks/                 # Custom React hooks
  useConverter.ts      # Main conversion logic
  useExchangeRates.ts  # Exchange rates fetching
  
utils/                 # Utility functions
  storage.ts           # LocalStorage management
  currency.ts          # Currency helpers
  
types/                 # TypeScript type definitions
  index.ts             # All shared types
```

## Development Guidelines

### Component Development

1. **Component Structure**
   - Use functional components with hooks
   - Prefer composition over inheritance
   - Keep components focused and reusable
   - Export with named exports in `components/index.ts`

2. **TypeScript Practices**
   - Define all prop types with interfaces
   - Use strict null checks
   - Avoid `any` type usage
   - Define types in `types/index.ts` for shared types

3. **Testing Requirements**
   - Create corresponding `.test.tsx` files for components
   - Use React Testing Library (prefer `screen` queries)
   - Test user interactions, not implementation details
   - Aim for meaningful coverage (not just coverage %)

### Custom Hooks

1. **Hook Patterns**
   - `useConverter`: Handles conversion logic (amount, currencies, history)
   - `useExchangeRates`: Manages API calls with caching and fallback
   - Use `useCallback` for memoized functions
   - Use `useEffect` for side effects

2. **API Integration with Hooks**
   - Implement caching to avoid unnecessary API calls
   - Handle loading and error states
   - Provide fallback data when appropriate
   - Log API failures for debugging

### API Routes

1. **Exchange Rates Endpoint** (`app/api/rates/route.ts`)
   - GET requests only
   - Implements multi-source fallback strategy
   - Returns JSON with rate data
   - Handles errors gracefully

2. **Error Handling**
   - Return meaningful HTTP status codes
   - Include error messages in response
   - Log errors for debugging

### Styling

1. **Tailwind CSS**
   - Use utility classes only (no custom CSS in components)
   - Follow responsive design: mobile-first approach
   - Common breakpoints: `sm:`, `md:`, `lg:`
   - Use consistent spacing: `p-4`, `mb-6`, etc.

2. **Color Scheme**
   - Primary: Tailwind blue variants
   - Accent: Tailwind green for success states
   - Error: Tailwind red for error states
   - Background: Tailwind neutral colors

### Testing

1. **Unit Tests**
   - Test files: `*.test.ts` or `*.test.tsx`
   - Run all tests: `npm test`
   - Watch mode: `npm run test:watch`
   - Coverage: `npm run test:coverage`

2. **Mocking**
   - Use MSW (Mock Service Worker) for API mocking
   - Mock external API calls in test setup
   - Use `jest.spyOn()` for internal function mocking

3. **Test Patterns**
   ```typescript
   // Component tests
   render(<Component />);
   expect(screen.getByRole('button')).toBeInTheDocument();
   
   // Hook tests use renderHook
   const { result } = renderHook(() => useConverter());
   expect(result.current.amount).toBe('100');
   ```

### Utilities

1. **Storage Utilities** (`utils/storage.ts`)
   - `getHistory()`: Retrieve conversion history from localStorage
   - `saveHistory()`: Save history to localStorage
   - `clearHistory()`: Clear all stored history

2. **Currency Utilities** (`utils/currency.ts`)
   - Currency validation functions
   - Formatting helpers
   - Conversion calculation functions

## Naming Conventions

### Components
- PascalCase: `ConverterForm.tsx`, `CurrencySelect.tsx`
- Props interfaces: `ComponentNameProps`

### Hooks
- Start with `use`: `useConverter`, `useExchangeRates`
- Return types clearly defined

### Files
- Components: `ComponentName.tsx`, `ComponentName.test.tsx`
- Utilities: `utilityName.ts`, `utilityName.test.ts`
- Hooks: `useHookName.ts`, `useHookName.test.ts`

### Variables and Functions
- camelCase for functions and variables
- CONSTANT_CASE for constants
- Boolean variables start with `is`, `has`, `should`: `isLoading`, `hasError`

## Common Tasks with Copilot

### Creating a New Component
When creating a new component, Copilot should help with:
- Component boilerplate with proper TypeScript typing
- Props interface definition
- Default exports and named exports
- Basic test file structure

**Ask**: "Create a new component `ComponentName` that [description]"

### Adding Tests
When adding tests, Copilot should help with:
- Proper test file imports
- Render and setup patterns
- Assertion patterns
- User interaction testing

**Ask**: "Add unit tests for `Component` covering [scenarios]"

### API Route Development
When building API routes, Copilot should help with:
- Proper Next.js API structure
- Error handling patterns
- Response formatting
- Testing API routes

**Ask**: "Create an API route for [endpoint] that [description]"

### Hook Development
When building custom hooks, Copilot should help with:
- Hook state management
- Effect cleanup
- Callback memoization
- TypeScript typing

**Ask**: "Create a custom hook `useHookName` that [functionality]"

## Key Patterns & Conventions

### Error Handling
- Wrap async operations in try-catch blocks
- Log errors with context information
- Return user-friendly error messages
- Provide fallback values when appropriate

### Performance
- Use `React.memo()` for expensive components
- Implement `useCallback` for event handlers passed as props
- Implement caching in API calls (1-hour default)
- Avoid unnecessary re-renders

### URL Parameters
- Use `searchParams` from Next.js for persistent state
- Sync form state with URL for shareable links
- Validate params before using

### Validation
- Validate input in components
- Show real-time validation feedback
- Prevent invalid submissions
- Type guard checks in utilities

## Troubleshooting with Copilot

1. **TypeScript Errors**: Ask Copilot to "Fix TypeScript errors in [file]"
2. **Test Failures**: Ask "Debug failing test for [component/function]"
3. **Performance Issues**: Ask "Identify performance bottlenecks in [component]"
4. **API Issues**: Ask "Add error handling for [API endpoint]"

## Testing Commands

```bash
npm test                  # Run all tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
npm run test:ci         # CI mode (used in pipelines)
```

## Build & Development Commands

```bash
npm run dev             # Start development server
npm run build           # Build for production
npm start              # Start production server
npm run lint           # Run ESLint
```

## Resources

- **Jest Documentation**: https://jestjs.io/
- **React Testing Library**: https://testing-library.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs

## Additional Context

### Supported Currencies
USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, INR, MXN

### Features to Maintain
- Real-time automatic conversion
- Conversion history (last 10 entries)
- Currency swapping
- URL parameter persistence
- API fallback strategy
- 1-hour caching

### Common Pitfalls to Avoid
- Don't hardcode API keys
- Don't skip TypeScript type definitions
- Don't forget to test error scenarios
- Don't test implementation details
- Don't forget to clean up effects and listeners
