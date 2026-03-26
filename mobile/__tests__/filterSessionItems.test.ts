import { buildMockResultForType } from '../src/services/recognition';
import { filterSessionItems } from '../src/session/filterSessionItems';
import { createSessionScanItem } from '../src/session/types';

describe('filterSessionItems (E5 / R14)', () => {
  function makeItem(type: 'invoice' | 'receipt' | 'business_card') {
    return createSessionScanItem({
      result: buildMockResultForType(type),
      previewUri: 'file:///x.png',
      inputSource: 'gallery',
    });
  }

  it('řazení vstupu zachová (kopie pole)', () => {
    const a = makeItem('invoice');
    const b = makeItem('receipt');
    const c = makeItem('business_card');
    const ordered = [a, b, c];
    const filtered = filterSessionItems(ordered, 'all');
    expect(filtered.map((i) => i.id)).toEqual([a.id, b.id, c.id]);
  });

  it('filtr „vše“ vrátí všechny položky', () => {
    const items = [makeItem('invoice'), makeItem('receipt')];
    expect(filterSessionItems(items, 'all')).toHaveLength(2);
  });

  it('filtr podle typu vrátí jen daný typ', () => {
    const items = [makeItem('invoice'), makeItem('receipt'), makeItem('invoice')];
    const inv = filterSessionItems(items, 'invoice');
    expect(inv).toHaveLength(2);
    expect(inv.every((i) => i.documentType === 'invoice')).toBe(true);
  });
});
