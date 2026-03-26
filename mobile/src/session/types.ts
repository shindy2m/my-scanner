import type { DocumentType } from '../types/document';
import type { DocumentInputSource, RecognitionResult } from '../services/recognition';

/**
 * Položka uložená v paměti relace (R10): čas, typ, standardní údaje,
 * kompletní přepis (jeden text), reference na vstup pro náhled.
 */
export interface SessionScanItem {
  id: string;
  scannedAt: string;
  documentType: DocumentType;
  standardFields: Record<string, string>;
  transcript: string;
  previewUri: string | null;
  inputSource: DocumentInputSource | null;
}

export function createSessionScanItem(params: {
  result: RecognitionResult;
  previewUri: string | null;
  inputSource: DocumentInputSource | null;
}): SessionScanItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    scannedAt: new Date().toISOString(),
    documentType: params.result.suggestedType,
    standardFields: { ...params.result.standardFields },
    transcript: params.result.transcript,
    previewUri: params.previewUri,
    inputSource: params.inputSource,
  };
}
