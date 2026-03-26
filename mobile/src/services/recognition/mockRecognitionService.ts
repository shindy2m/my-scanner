import {
  pickDocumentTypeFromUri,
  resolveMockScenario,
} from './buildMockResult';
import { dequeueRecognitionMockQueueItem } from './e2eRecognitionHooks';
import type { RecognitionRequest, RecognitionService } from './types';

const MOCK_DELAY_MS = 400;

export function createMockRecognitionService(
  delayMs: number = MOCK_DELAY_MS
): RecognitionService {
  return {
    async recognize(request: RecognitionRequest) {
      await new Promise((r) => setTimeout(r, delayMs));
      const queued = dequeueRecognitionMockQueueItem();
      if (queued?.type === 'error') {
        throw new Error(queued.message);
      }
      if (queued?.type === 'result') {
        return resolveMockScenario(queued.scenario);
      }
      const scenario =
        request.mockScenario ??
        (request.inputUri != null && request.inputUri.length > 0
          ? pickDocumentTypeFromUri(request.inputUri)
          : undefined);
      return resolveMockScenario(scenario);
    },
  };
}

/** Výchozí mock pro aplikaci (bez síťového volání). */
export const mockRecognitionService = createMockRecognitionService();
