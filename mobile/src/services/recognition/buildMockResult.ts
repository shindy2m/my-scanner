import type { DocumentType } from '../../types/document';
import {
  BUSINESS_CARD_STANDARD_FIELDS,
  INVOICE_STANDARD_FIELDS,
  RECEIPT_STANDARD_FIELDS,
} from './standardFields';
import type { RecognitionResult, RecognitionMockScenario } from './types';

function emptyFields(keys: readonly { key: string }[]): Record<string, string> {
  return Object.fromEntries(keys.map(({ key }) => [key, '']));
}

function buildInvoiceMock(): RecognitionResult {
  const fields = emptyFields(INVOICE_STANDARD_FIELDS);
  fields.invoiceNumber = 'FV-2025-0042';
  fields.issueDate = '2025-03-01';
  fields.dueDate = '2025-03-15';
  fields.supplierName = 'Ukázková s.r.o.';
  fields.supplierVatId = '12345678';
  fields.customerName = 'Odběratel a.s.';
  fields.totalAmount = '12 400,00';
  fields.currency = 'CZK';
  fields.totalVat = '2 157,02';
  return {
    suggestedType: 'invoice',
    typeConfidence: 'high',
    standardFields: fields,
    transcript:
      'FAKTURA č. FV-2025-0042\nDatum vystavení: 1. 3. 2025\nDodavatel: Ukázková s.r.o., IČ 12345678\n' +
      'Odběratel: Odběratel a.s.\nPoložky: služby konzultace 40 hodin\nCelkem: 12 400 Kč vč. DPH\n' +
      'Způsob platby: převodem na účet.',
  };
}

function buildReceiptMock(): RecognitionResult {
  const fields = emptyFields(RECEIPT_STANDARD_FIELDS);
  fields.merchant = 'Supermarket Hlavní';
  fields.dateTime = '2025-03-26 18:42';
  fields.totalAmount = '487,30';
  fields.currency = 'CZK';
  return {
    suggestedType: 'receipt',
    typeConfidence: 'high',
    standardFields: fields,
    transcript:
      'SUPERMARKET HLAVNÍ\n26. 3. 2025 18:42\n--------------------------------\nMLÉKO 1L ........ 29,90\nCHLÉB ........... 42,00\n' +
      '--------------------------------\nCELKEM 487,30 Kč\nDěkujeme za nákup.',
  };
}

function buildBusinessCardMock(): RecognitionResult {
  const fields = emptyFields(BUSINESS_CARD_STANDARD_FIELDS);
  fields.fullName = 'Jan Novák';
  fields.companyOrRole = 'ACME · Vedoucí prodeje';
  fields.phone = '+420 777 888 999';
  fields.email = 'jan.novak@acme.example';
  fields.web = 'https://acme.example';
  fields.address = 'Praha 1, Václavské nám. 1';
  return {
    suggestedType: 'business_card',
    typeConfidence: 'high',
    standardFields: fields,
    transcript:
      'Jan Novák\nVedoucí prodeje | ACME s.r.o.\n+420 777 888 999\njan.novak@acme.example\nacme.example\nPraha',
  };
}

const builders: Record<DocumentType, () => RecognitionResult> = {
  invoice: buildInvoiceMock,
  receipt: buildReceiptMock,
  business_card: buildBusinessCardMock,
};

/** Syntetický výsledek pro daný typ – všechny standardní klíče typu jsou v standardFields. */
export function buildMockResultForType(type: DocumentType): RecognitionResult {
  return builders[type]();
}

/**
 * Nejistý návrh: model „tipuje“ fakturu, ale confidence je nízká (příprava na R6).
 */
export function buildUncertainMockResult(): RecognitionResult {
  const base = buildInvoiceMock();
  return {
    ...base,
    typeConfidence: 'low',
  };
}

export function resolveMockScenario(
  scenario: RecognitionMockScenario | undefined
): RecognitionResult {
  if (scenario === 'uncertain') {
    return buildUncertainMockResult();
  }
  if (scenario === undefined) {
    return buildInvoiceMock();
  }
  return buildMockResultForType(scenario);
}

/** Deterministický výběr ukázkového typu z URI (mock neanalyzuje pixely). */
export function pickDocumentTypeFromUri(uri: string): DocumentType {
  let h = 0;
  for (let i = 0; i < uri.length; i++) {
    h = (Math.imul(31, h) + uri.charCodeAt(i)) | 0;
  }
  const types: DocumentType[] = ['invoice', 'receipt', 'business_card'];
  return types[Math.abs(h) % 3];
}
