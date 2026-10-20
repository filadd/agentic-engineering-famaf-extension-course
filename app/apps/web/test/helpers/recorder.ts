// Collects the requests a handler received, so a test can assert what the
// screen sent.
export const recorder = <T>() => {
  const calls: Array<T> = [];

  return { calls, record: (call: T) => calls.push(call) };
};
