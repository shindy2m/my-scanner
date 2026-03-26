import type { RecognitionRequest, RecognitionService } from './types';
import { resolveMockScenario } from './buildMockResult';

const MOCK_DELAY_MS = 400;

export function createMockRecognitionService(
  delayMs: number = MOCK_DELAY_MS
): RecognitionService {
  return {
    async recognize(request: RecognitionRequest) {
      await new Promise((r) => setTimeout(r, delayMs));
      return resolveMockScenario(request.mockScenario);
    },
  };
}

/** Výchozí mock pro aplikaci (bez síťového volání). */
export const mockRecognitionService = createMockRecognitionService();
