export type {
  DocumentInputSource,
  RecognitionRequest,
  RecognitionResult,
  RecognitionMockScenario,
  RecognitionService,
} from './types';
export {
  getStandardFieldDefinitions,
  getStandardFieldKeys,
  INVOICE_STANDARD_FIELDS,
  RECEIPT_STANDARD_FIELDS,
  BUSINESS_CARD_STANDARD_FIELDS,
} from './standardFields';
export {
  buildMockResultForType,
  pickDocumentTypeFromUri,
  resolveMockScenario,
} from './buildMockResult';
export {
  createMockRecognitionService,
  mockRecognitionService,
} from './mockRecognitionService';
export { getConfiguredRecognitionService } from './getConfiguredRecognitionService';
export {
  getRecognitionBackend,
  getRecognitionLoadingHint,
  isMockExplicitlyForced,
  recognitionSendsDataOffDevice,
  type RecognitionBackend,
} from './recognitionEnv';
export {
  normalizeRecognitionPayload,
  parseRecognitionJsonString,
} from './parseRecognitionPayload';
export { remapStandardFieldsForType } from './remapStandardFieldsForType';
