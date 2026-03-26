import {
  buildMockResultForType,
  getStandardFieldKeys,
} from '../src/services/recognition';
import { createSessionScanItem } from '../src/session/types';

describe('createSessionScanItem (R10)', () => {
  it('uchová typ, všechna pole a kompletní přepis', () => {
    const result = buildMockResultForType('invoice');
    const item = createSessionScanItem({
      result,
      previewUri: 'file:///tmp/x.png',
      inputSource: 'gallery',
    });

    expect(item.documentType).toBe('invoice');
    expect(item.previewUri).toBe('file:///tmp/x.png');
    expect(item.inputSource).toBe('gallery');
    expect(item.transcript).toBe(result.transcript);
    expect(new Date(item.scannedAt).getTime()).not.toBeNaN();
    expect(item.id.length).toBeGreaterThan(0);

    const keys = getStandardFieldKeys('invoice');
    for (const k of keys) {
      expect(item.standardFields[k]).toBe(result.standardFields[k]);
    }
  });

  it('umožní prázdný přepis a null náhled', () => {
    const base = buildMockResultForType('receipt');
    const result = { ...base, transcript: '' };
    const item = createSessionScanItem({
      result,
      previewUri: null,
      inputSource: null,
    });
    expect(item.transcript).toBe('');
    expect(item.previewUri).toBeNull();
    expect(item.inputSource).toBeNull();
  });
});
