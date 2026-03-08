---
name: bug-fix
description: Describe when to use this prompt
---

# Bug Fixing Guide

## Overview

This guide provides best practices for identifying, fixing, and validating bug fixes in the Currency Converter project.

## Bug Fixing Process

### 1. Identify the Bug

Start by understanding what's broken:
- **Reproduce the issue**: Can you reliably reproduce the bug?
- **Understand the expected behavior**: What should happen vs. what's happening?
- **Locate the problem area**: Which component, hook, or utility is involved?
- **Check tests**: Do existing tests reveal the issue?

### 2. Analyze the Root Cause

Before fixing, understand why the bug exists:
- **Code review**: Read the relevant code carefully
- **Check related files**: Look at connected components, hooks, or utilities
- **Trace the flow**: Follow the data/logic flow to find where it breaks
- **Check git history**: Look at recent changes that might have introduced the bug

### 3. Implement the Fix

When writing the fix:
- **Keep it focused**: Fix only the specific bug, don't refactor
- **Follow conventions**: Use the project's naming and code style
- **Add error handling**: Ensure the fix handles edge cases
- **Update types**: If TypeScript types are affected, update them
- **Add comments**: Explain non-obvious fixes with comments

### 4. Test the Fix

**CRITICAL**: Always run tests after applying a fix!

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Check coverage for the affected areas
npm run test:coverage
```

### 5. Verify the Fix

Confirm that your fix:
- ✅ Resolves the reported issue
- ✅ All tests pass (no new failures)
- ✅ Related functionality still works
- ✅ No TypeScript errors
- ✅ No console errors or warnings

## Bug Fixing Checklist

When fixing a bug in this project:

- [ ] I can reproduce the bug consistently
- [ ] I identified the root cause
- [ ] I found the relevant code/component
- [ ] I implemented the fix
- [ ] All tests pass: `npm test`
- [ ] No new test failures introduced
- [ ] TypeScript reports no errors
- [ ] I tested the fix manually
- [ ] Related features still work correctly
- [ ] I added comments explaining non-obvious fixes

## Common Bug Categories

### Component Bugs

**Symptoms**: UI doesn't show correctly, events don't trigger, props not applied

**Approach**:
1. Check component rendering logic
2. Verify props are passed correctly
3. Check state updates and side effects
4. Look at conditional rendering
5. Run component tests

**Test with**:
```bash
npm test -- ComponentName
```

### Hook Bugs

**Symptoms**: State doesn't update, effects don't run, data is stale

**Approach**:
1. Check useEffect dependencies
2. Verify state initialization
3. Look at callback memoization
4. Check for infinite loops
5. Run hook tests

**Test with**:
```bash
npm test -- useHookName
```

### API/Data Bugs

**Symptoms**: Wrong data returned, API calls fail, caching issues

**Approach**:
1. Check API route implementation
2. Verify data transformation
3. Look at error handling
4. Check caching logic
5. Review API test mocks

**Test with**:
```bash
npm test -- route.test
```

### Utility/Logic Bugs

**Symptoms**: Calculations wrong, validation fails, helpers return incorrect values

**Approach**:
1. Check function logic step-by-step
2. Test with edge cases (empty, null, invalid)
3. Verify type conversions
4. Look at boundary conditions
5. Review utility tests

**Test with**:
```bash
npm test -- utility.test
```

## Testing After Bug Fixes

### Unit Tests
Ensure the specific function/component works:
```bash
npm test -- FileName
```

### All Tests
Run the full test suite to catch regressions:
```bash
npm test
```

### Watch Mode
During development, run tests automatically:
```bash
npm run test:watch
```

### Coverage Report
Check if affected code is well-tested:
```bash
npm run test:coverage
```

## Using Copilot for Bug Fixing

### Effective Prompts

**Good**: "Fix the bug in `ConverterForm.tsx` where the currency swap button doesn't update the exchange rate correctly"

**Better**: "Fix the bug in `ConverterForm.tsx` where the currency swap button doesn't update the exchange rate. The swap happens but the result doesn't recalculate. After fixing, I'll run tests to validate."

**Best**: "Fix the bug in `ConverterForm.tsx` where the currency swap button doesn't update the exchange rate. When I swap currencies, the form swaps them but the `ConversionResult` component shows the old rate instead of recalculating. Check the `useConverter` hook and form state flow."

### Asking for Test Help

If tests fail after a fix:

**Ask**: "Why is the test `should update rate when currency changes` failing after my fix? The fix changes how the state is updated in the hook."

**Ask**: "Update the test for `ConverterForm` to reflect the new behavior where swap triggers an automatic recalculation."

## Common Pitfalls to Avoid

- ❌ **Don't skip tests**: Always run tests after fixing
- ❌ **Don't change unrelated code**: Focus on the bug only
- ❌ **Don't ignore TypeScript errors**: Fix type issues properly
- ❌ **Don't forget cleanup**: Clean up effects and listeners
- ❌ **Don't break existing tests**: Ensure all tests still pass
- ❌ **Don't hide errors**: Handle errors properly, don't suppress them

## Resources

- [Debugging Tools in VS Code](https://code.visualstudio.com/docs/editor/debugging)
- [Jest Testing](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [TypeScript Debugging](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## When to Ask for Help

Ask Copilot if:
- You can't reproduce the bug
- You don't understand the codebase
- Tests are failing and you're not sure why
- You need help identifying the root cause
- You're unsure if your fix is complete

**Key**: Always run tests to validate any fix!
