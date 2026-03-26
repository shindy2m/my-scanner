import type { DocumentType } from '../../types/document';
import { getStandardFieldKeys } from './standardFields';
import type { RecognitionResult } from './types';

const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
/** Min. ~9 číslic (vyhne se krátkým číslům typu IČ v jedné skupině). */
const PHONE_RE =
  /\+420[\s.\-/]?\d{3}[\s.\-/]?\d{3}[\s.\-/]?\d{3}|(?:\d[\s.\-/]?){8,}\d/;
const WEB_RE = /https?:\/\/[^\s]+|www\.[^\s]+/i;

function transcriptHints(
  transcript: string,
  targetType: DocumentType
): Partial<Record<string, string>> {
  const hints: Partial<Record<string, string>> = {};
  if (targetType !== 'business_card') {
    return hints;
  }
  const email = transcript.match(EMAIL_RE);
  if (email) hints.email = email[0];
  const phone = transcript.match(PHONE_RE);
  if (phone) {
    hints.phone = phone[0].replace(/\s+/g, ' ').trim();
  }
  const web = transcript.match(WEB_RE);
  if (web) hints.web = web[0];
  return hints;
}

/**
 * Přemapuje standardní údaje na sadu polí cílového typu výhradně z prvního výsledku
 * rozpoznání (R12): shodné klíče se zkopírují, zbytek doplní jednoduché nápovědy
 * z přepisu kde dává smysl (vizitka: e-mail, telefon, web).
 */
export function remapStandardFieldsForType(
  raw: RecognitionResult,
  targetType: DocumentType
): Record<string, string> {
  const source = raw.standardFields;
  const sourceKeys = new Set(Object.keys(source));
  const targetKeys = getStandardFieldKeys(targetType);
  const out: Record<string, string> = {};

  for (const key of targetKeys) {
    const v = source[key];
    if (sourceKeys.has(key) && v != null && String(v).trim() !== '') {
      out[key] = v;
    } else {
      out[key] = '';
    }
  }

  const hints = transcriptHints(raw.transcript, targetType);
  for (const key of targetKeys) {
    if (!out[key]?.trim() && hints[key]) {
      out[key] = hints[key]!;
    }
  }

  return out;
}
