import type { QueryClient, QueryKey } from "@tanstack/react-query";

export interface OptimisticPatch<I> {
  readonly key: (input: I) => QueryKey;
  readonly exact: boolean;
  readonly apply: (queryClient: QueryClient, input: I) => void;
}

interface Patch<T, I> {
  readonly key: (input: I) => QueryKey;
  readonly exact?: boolean;
  readonly patch: (previous: T, input: I) => T;
}

// Each key holds its own data type. Binding it here, where the patch is
// written, keeps the list a mutation receives free of casts. The key is a
// function of the input because some name one record, such as one session.
export const optimisticPatch = <T, I>({
  key,
  exact = false,
  patch,
}: Patch<T, I>): OptimisticPatch<I> => ({
  key,
  exact,
  apply: (queryClient, input) =>
    queryClient.setQueriesData<T>({ queryKey: key(input), exact }, (previous) =>
      previous == null ? previous : patch(previous, input),
    ),
});
