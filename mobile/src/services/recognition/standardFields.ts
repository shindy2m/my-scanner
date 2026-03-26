import type { DocumentType } from '../../types/document';

/** Klíče a české popisky standardních údajů podle PRD (tabulka typů). */
export const INVOICE_STANDARD_FIELDS = [
  { key: 'invoiceNumber', label: 'Číslo faktury' },
  { key: 'issueDate', label: 'Datum vystavení' },
  { key: 'dueDate', label: 'Datum splatnosti' },
  { key: 'supplierName', label: 'Dodavatel (název)' },
  { key: 'supplierVatId', label: 'IČ dodavatele' },
  { key: 'customerName', label: 'Odběratel (název)' },
  { key: 'totalAmount', label: 'Celková částka' },
  { key: 'currency', label: 'Měna' },
  { key: 'totalVat', label: 'DPH celkem' },
] as const;

export const RECEIPT_STANDARD_FIELDS = [
  { key: 'merchant', label: 'Prodejce / obchod' },
  { key: 'dateTime', label: 'Datum a čas' },
  { key: 'totalAmount', label: 'Celková částka' },
  { key: 'currency', label: 'Měna' },
] as const;

export const BUSINESS_CARD_STANDARD_FIELDS = [
  { key: 'fullName', label: 'Jméno a příjmení' },
  { key: 'companyOrRole', label: 'Společnost / pozice' },
  { key: 'phone', label: 'Telefon' },
  { key: 'email', label: 'E-mail' },
  { key: 'web', label: 'Web' },
  { key: 'address', label: 'Adresa' },
] as const;

export type InvoiceFieldKey = (typeof INVOICE_STANDARD_FIELDS)[number]['key'];
export type ReceiptFieldKey = (typeof RECEIPT_STANDARD_FIELDS)[number]['key'];
export type BusinessCardFieldKey = (typeof BUSINESS_CARD_STANDARD_FIELDS)[number]['key'];

export function getStandardFieldDefinitions(type: DocumentType) {
  switch (type) {
    case 'invoice':
      return INVOICE_STANDARD_FIELDS;
    case 'receipt':
      return RECEIPT_STANDARD_FIELDS;
    case 'business_card':
      return BUSINESS_CARD_STANDARD_FIELDS;
  }
}

export function getStandardFieldKeys(type: DocumentType): string[] {
  return getStandardFieldDefinitions(type).map((f) => f.key);
}
