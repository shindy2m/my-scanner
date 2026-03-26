import type { DocumentType } from '../../types/document';

/** Oddělené shrnutí a tělo přepisu (R9). */
export interface Transcript {
  summary: string;
  body: string;
}

/**
 * Výstup rozpoznání – kontrakt pro mock i pozdější OpenAI (E7).
 * standardFields obsahuje všechny klíče daného typu (prázdné řetězce povoleny).
 */
export interface RecognitionResult {
  suggestedType: DocumentType;
  /** Nízká jistota → scénář R6 (uživatel vybere typ). */
  typeConfidence: 'high' | 'low';
  standardFields: Record<string, string>;
  transcript: Transcript;
}

export type RecognitionMockScenario = DocumentType | 'uncertain';

/** Zdroj vstupu pro R1–R3 a později pro API (E7). */
export type DocumentInputSource = 'camera' | 'gallery' | 'file';

export interface RecognitionRequest {
  /** E1/E2: výběr mock výstupu; u reálného API se ignoruje. */
  mockScenario?: RecognitionMockScenario;
  /**
   * Lokální URI obrázku po výběru uživatelem.
   * Mock odvozuje ukázkový typ z URI (deterministicky); E7 obrázek odešle do API.
   */
  inputUri?: string;
  inputSource?: DocumentInputSource;
}

export interface RecognitionService {
  recognize(request: RecognitionRequest): Promise<RecognitionResult>;
}
