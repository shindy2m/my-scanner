import type { RecognitionMockScenario } from './types';

/**
 * Volitelná fronta pro E2E (Playwright): přepíše další volání mock rozpoznání.
 * V Node/Jest se `window` nepoužívá — logika mocku zůstává beze změny.
 */
export type E2ERecognitionQueueItem =
  | { type: 'result'; scenario: RecognitionMockScenario }
  | { type: 'error'; message: string };

declare global {
  interface Window {
    __MYSCANNER_E2E_QUEUE?: E2ERecognitionQueueItem[];
  }
}

export function dequeueRecognitionMockQueueItem():
  | E2ERecognitionQueueItem
  | undefined {
  if (typeof window === 'undefined') return undefined;
  const q = window.__MYSCANNER_E2E_QUEUE;
  if (!q?.length) return undefined;
  return q.shift();
}
