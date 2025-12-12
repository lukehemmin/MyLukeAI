# Fix Infinite Loop in API Key Management

The "flood" of SQL queries is caused by an infinite loop in the `ApiKeyManager` component, triggered by a bug in the `useToast` hook.

## Diagnosis
1. `ApiKeyManager` fetches keys in a `useEffect` that depends on `fetchApiKeys`.
2. `fetchApiKeys` is wrapped in `useCallback` but depends on `toast`.
3. The `useToast` hook returns a **new** `toast` function on every render because it's not memoized with `useCallback`.
4. When `fetchApiKeys` completes (success or fail), it updates state, causing `ApiKeyManager` to re-render.
5. The re-render creates a new `toast` function.
6. This forces `fetchApiKeys` to be recreated.
7. The `useEffect` sees a new `fetchApiKeys` and runs again, restarting the cycle.

## Plan
1.  **Modify `src/components/ui/use-toast.ts`**:
    *   Import `useCallback` from 'react'.
    *   Wrap `toast` and `dismiss` functions in `useCallback` to ensure they maintain a stable reference across renders.

This will break the dependency cycle and stop the infinite fetching loop.
