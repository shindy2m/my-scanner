import type { DocumentType } from '../../types/document';
import { getStandardFieldKeys } from './standardFields';
import type { RecognitionResult } from './types';

const DOCUMENT_TYPES = new Set<DocumentType>([
  'invoice',
  'receipt',
  'business_card',
]);

function asString(v: unknown): string {
  if (typeof v !== 'string') return v != null ? String(v) : '';
  return v;
}

/**
 * Normalizuje JSON z OpenAI / proxy do RecognitionResult.
 * Chybějící pole doplňuje prázdnými řetězci dle navrženého typu.
 */
export function normalizeRecognitionPayload(raw: unknown): RecognitionResult {
  if (raw === null || typeof raw !== 'object') {
    throw new Error('INVALID_PAYLOAD');
  }
  const o = raw as Record<string, unknown>;

  const suggested = o.suggestedType;
  if (typeof suggested !== 'string' || !DOCUMENT_TYPES.has(suggested as DocumentType)) {
    throw new Error('INVALID_TYPE');
  }
  const suggestedType = suggested as DocumentType;

  let typeConfidence: 'high' | 'low' = 'high';
  if (o.typeConfidence === 'low' || o.typeConfidence === 'high') {
    typeConfidence = o.typeConfidence;
  } else if (typeof o.typeConfidence === 'string') {
    throw new Error('INVALID_CONFIDENCE');
  }

  const keys = getStandardFieldKeys(suggestedType);
  const incoming =
    o.standardFields !== null && typeof o.standardFields === 'object'
      ? (o.standardFields as Record<string, unknown>)
      : {};

  const standardFields: Record<string, string> = {};
  for (const key of keys) {
    const val = incoming[key];
    standardFields[key] = typeof val === 'string' ? val : val != null ? String(val) : '';
  }

  return {
    suggestedType,
    typeConfidence,
    standardFields,
    transcript: asString(o.transcript),
  };
}

function stripMarkdownFences(raw: string): string {
  const t = raw.trim();
  const m = /^```(?:json)?\s*([\s\S]*?)```$/i.exec(t);
  if (m?.[1]) return m[1].trim();
  return t;
}

export function parseRecognitionJsonString(text: string): RecognitionResult {
  const trimmed = stripMarkdownFences(text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed) as unknown;
  } catch {
    throw new Error('JSON_PARSE');
  }
  return normalizeRecognitionPayload(parsed);
}
