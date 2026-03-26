import { createMockRecognitionService } from './mockRecognitionService';
import { createOpenAIRecognitionService } from './openaiRecognitionService';
import { createProxyRecognitionService } from './proxyRecognitionService';
import { getRecognitionBackend } from './recognitionEnv';
import type { RecognitionService } from './types';

/**
 * Služba rozpoznání podle proměnných prostředí (viz docs/openai-recognition.md).
 */
export function getConfiguredRecognitionService(): RecognitionService {
  const backend = getRecognitionBackend();
  switch (backend) {
    case 'openai':
      return createOpenAIRecognitionService();
    case 'proxy':
      return createProxyRecognitionService();
    default:
      return createMockRecognitionService();
  }
}
