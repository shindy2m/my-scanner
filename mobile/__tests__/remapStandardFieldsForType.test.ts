import {
  buildMockResultForType,
  remapStandardFieldsForType,
} from '../src/services/recognition';

describe('remapStandardFieldsForType (E4 / R12)', () => {
  it('při stejném typu vrátí stejné hodnoty jako ve zdroji', () => {
    const raw = buildMockResultForType('invoice');
    const mapped = remapStandardFieldsForType(raw, 'invoice');
    expect(mapped).toEqual(raw.standardFields);
  });

  it('z faktury na účtenku zkopíruje společné klíče (částka, měna)', () => {
    const raw = buildMockResultForType('invoice');
    const mapped = remapStandardFieldsForType(raw, 'receipt');
    expect(mapped.totalAmount).toBe(raw.standardFields.totalAmount);
    expect(mapped.currency).toBe(raw.standardFields.currency);
    expect(mapped.merchant).toBe('');
    expect(mapped.dateTime).toBe('');
  });

  it('z účtenky na fakturu zkopíruje částku a měnu, ostatní faktura prázdná', () => {
    const raw = buildMockResultForType('receipt');
    const mapped = remapStandardFieldsForType(raw, 'invoice');
    expect(mapped.totalAmount).toBe(raw.standardFields.totalAmount);
    expect(mapped.currency).toBe(raw.standardFields.currency);
    expect(mapped.invoiceNumber).toBe('');
  });

  it('kompletní přepis se nemění funkcí – zůstává v raw výsledku', () => {
    const raw = buildMockResultForType('receipt');
    expect(remapStandardFieldsForType(raw, 'invoice')).toBeDefined();
    expect(raw.transcript).toContain('SUPERMARKET');
  });

  it('z přepisu doplní e-mail pro vizitku, pokud ve strukturovaných polích chybí', () => {
    const raw = buildMockResultForType('receipt');
    const mapped = remapStandardFieldsForType(raw, 'business_card');
    expect(mapped.email).toBe('');
    const withEmail = {
      ...raw,
      transcript: `${raw.transcript}\nkontakt@obchod.cz`,
    };
    const m2 = remapStandardFieldsForType(withEmail, 'business_card');
    expect(m2.email).toBe('kontakt@obchod.cz');
  });
});
