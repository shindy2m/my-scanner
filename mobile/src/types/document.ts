/** Typ dokumentu dle PRD (interní klíč v kódu). */
export type DocumentType = 'invoice' | 'receipt' | 'business_card';

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  invoice: 'Faktura',
  receipt: 'Účtenka z obchodu',
  business_card: 'Vizitka',
};
