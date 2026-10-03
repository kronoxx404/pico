
/* eslint-disable @typescript-eslint/no-explicit-any */
const globalAny = global as any;

if (!globalAny.__sessionStore) {
  globalAny.__sessionStore = {};
}

export const sessionStore: Record<string, string> = globalAny.__sessionStore;