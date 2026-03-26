import type { DocumentType } from '../types/document';
import type { SessionScanItem } from './types';

export type HistoryFilter = 'all' | DocumentType;

export function filterSessionItems(
  items: readonly SessionScanItem[],
  filter: HistoryFilter
): SessionScanItem[] {
  if (filter === 'all') {
    return [...items];
  }
  return items.filter((i) => i.documentType === filter);
}
