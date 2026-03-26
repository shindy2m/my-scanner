import type { DocumentType } from '../../types/document';
import { getStandardFieldKeys } from './standardFields';
import type { RecognitionResult } from './types';

const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
/** Min. ~9 číslic (vyhne se krátkým číslům typu IČ v jedné skupině). */
const PHONE_RE =
  /\+420[\s.\-/]?\d{3}[\s.\-/]?\d{3}[\s.\-/]?\d{3}|(?:\d[\s.\-/]?){8,}\d/;
const WEB_RE = /https?:\/\/[^\s]+|www\.[^\s]+/i;

/** Datum a čas typické pro účtenku (d. m. yyyy hh:mm). */
const RECEIPT_DATETIME_RE =
  /(\d{1,2}\.\s*\d{1,2}\.\s*\d{4}\s+\d{1,2}:\d{2})/;
/** Samostatné datum (bez času). */
const RECEIPT_DATE_ONLY_RE = /\b(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})\b/;

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function isLikelyInvoiceOrReceiptLabelLine(line: string): boolean {
  const l = line.toLowerCase();
  if (/^(faktura|účtenka|daňový|paragon|receipt|invoice)\b/i.test(line)) {
    return true;
  }
  if (
    /datum\s*vystavení|datum\s*splatnosti|dodavatel|odběratel|číslo\s*faktury|položky|způsob\s*platby|ic\s*dodavatele/i.test(
      l
    )
  ) {
    return true;
  }
  if (/^ič\s*o?\s*:/i.test(line) || /^ič\s*:/i.test(line)) {
    return true;
  }
  if (/celkem|celek|k\s*úhradě|suma|total/i.test(l) && /\d/.test(line)) {
    return true;
  }
  return false;
}

function receiptHintsFromTranscript(
  transcript: string
): Partial<Record<string, string>> {
  const hints: Partial<Record<string, string>> = {};
  const lines = transcript
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter((x) => x.length > 0);

  const withTime = transcript.match(RECEIPT_DATETIME_RE);
  if (withTime) {
    hints.dateTime = normalizeWhitespace(withTime[1]);
  } else {
    for (const line of lines) {
      const l = line.trim();
      if (!l) continue;
      if (/datum\s*vystavení|datum\s*splatnosti/i.test(l)) {
        continue;
      }
      const timeOnLine = l.match(
        /^(\d{1,2}\.\s*\d{1,2}\.\s*\d{4}\s+\d{1,2}:\d{2})\s*$/
      );
      if (timeOnLine) {
        hints.dateTime = normalizeWhitespace(timeOnLine[1]);
        break;
      }
      const dateOnLine = l.match(
        new RegExp(`^${RECEIPT_DATE_ONLY_RE.source}\\s*$`, 'i')
      );
      if (dateOnLine) {
        hints.dateTime = normalizeWhitespace(dateOnLine[1]);
        break;
      }
    }
  }

  const celkem = transcript.match(
    /celkem\s*:?\s*([\d\s]+(?:[,.]\d{2})?)\s*(Kč|CZK|EUR|€)?/im
  );
  if (celkem) {
    hints.totalAmount = normalizeWhitespace(celkem[1].replace(/\s+/g, ' '));
    const cur = celkem[2]?.toUpperCase();
    if (cur === 'KČ' || cur === 'CZK') {
      hints.currency = 'CZK';
    } else if (cur === 'EUR' || cur === '€') {
      hints.currency = 'EUR';
    }
  }

  for (const line of lines) {
    if (line.length < 3) continue;
    if (isLikelyInvoiceOrReceiptLabelLine(line)) continue;
    if (/^[-_=]{3,}$/.test(line)) continue;
    hints.merchant = line;
    break;
  }

  return hints;
}

/** Číslo faktury a základní datum z textu faktury (při změně typu z jiného dokumentu). */
function invoiceHintsFromTranscript(
  transcript: string
): Partial<Record<string, string>> {
  const hints: Partial<Record<string, string>> = {};
  if (
    !/\bfaktura\b/i.test(transcript) &&
    !/daňový\s+doklad/i.test(transcript)
  ) {
    return hints;
  }
  const invNo = transcript.match(
    /\bfaktura\b[^\n]{0,50}?[.:\s#№]*\s*([A-Z0-9][A-Z0-9\-/.]{2,})/im
  );
  if (invNo) {
    hints.invoiceNumber = invNo[1].trim();
  }
  const issue = transcript.match(
    /datum\s*vystavení\s*:?\s*(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/im
  );
  if (issue) {
    hints.issueDate = normalizeWhitespace(issue[1]);
  }
  const due = transcript.match(
    /datum\s*splatnosti\s*:?\s*(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/im
  );
  if (due) {
    hints.dueDate = normalizeWhitespace(due[1]);
  }
  const supplier = transcript.match(
    /dodavatel\s*:?\s*(.+?)(?:\n|$|,?\s*IČ)/im
  );
  if (supplier) {
    hints.supplierName = normalizeWhitespace(supplier[1]).replace(/,$/, '');
  }
  const customer = transcript.match(/odběratel\s*:?\s*(.+?)(?:\n|$)/im);
  if (customer) {
    hints.customerName = normalizeWhitespace(customer[1]).replace(/,$/, '');
  }
  const celkem = transcript.match(
    /celkem\s*:?\s*([\d\s]+(?:[,.]\d{2})?)\s*(Kč|CZK)?/im
  );
  if (celkem) {
    hints.totalAmount = normalizeWhitespace(celkem[1].replace(/\s+/g, ' '));
    hints.currency = 'CZK';
  }
  return hints;
}

function transcriptHints(
  transcript: string,
  targetType: DocumentType
): Partial<Record<string, string>> {
  if (targetType === 'business_card') {
    const hints: Partial<Record<string, string>> = {};
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
  if (targetType === 'receipt') {
    return receiptHintsFromTranscript(transcript);
  }
  if (targetType === 'invoice') {
    return invoiceHintsFromTranscript(transcript);
  }
  return {};
}

/**
 * Přemapuje standardní údaje na sadu polí cílového typu výhradně z prvního výsledku
 * rozpoznání (R12): shodné klíče se zkopírují, zbytek doplní nápovědy z přepisu kde dává smysl.
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

  /**
   * Při změně typu na účtenku: pokud z přepisu poznáme „hlavičku“ účtenky (prodejce),
   * přepíšeme i sdílená pole částka/měna – jinak by zůstaly z chybně navržené faktury.
   */
  if (
    targetType === 'receipt' &&
    raw.suggestedType !== 'receipt' &&
    hints.merchant?.trim()
  ) {
    out.merchant = hints.merchant;
    if (hints.dateTime?.trim()) {
      out.dateTime = hints.dateTime;
    }
    if (hints.totalAmount?.trim()) {
      out.totalAmount = hints.totalAmount;
    }
    if (hints.currency?.trim()) {
      out.currency = hints.currency;
    }
  }

  return out;
}
