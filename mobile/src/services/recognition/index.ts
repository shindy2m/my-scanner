export type {
  DocumentInputSource,
  RecognitionRequest,
  RecognitionResult,
  RecognitionMockScenario,
  RecognitionService,
  Transcript,
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
