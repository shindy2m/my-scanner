import {
  buildMockResultForType,
  getStandardFieldKeys,
  mockRecognitionService,
  pickDocumentTypeFromUri,
  resolveMockScenario,
} from '../src/services/recognition';

describe('mock recognition (PRD struktura)', () => {
  it.each(['invoice', 'receipt', 'business_card'] as const)(
    'vrátí pro typ %s všechny standardní klíče dle PRD',
    (type) => {
      const result = buildMockResultForType(type);
      const expected = new Set(getStandardFieldKeys(type));
      const actual = new Set(Object.keys(result.standardFields));
      expect(actual).toEqual(expected);
    }
  );

  it('vrátí neprázdný kompletní přepis (jeden text)', () => {
    const result = buildMockResultForType('invoice');
    expect(result.transcript.trim().length).toBeGreaterThan(0);
  });

  it('nejistý scénář má nízkou jistotu typu', () => {
    const r = resolveMockScenario('uncertain');
    expect(r.typeConfidence).toBe('low');
  });

  it('pickDocumentTypeFromUri je deterministické a vrací jeden ze tří typů', () => {
    const uri = 'content://mock/photo-abc.jpg';
    expect(pickDocumentTypeFromUri(uri)).toBe(pickDocumentTypeFromUri(uri));
    expect(['invoice', 'receipt', 'business_card']).toContain(
      pickDocumentTypeFromUri(uri)
    );
  });

  it('mock recognize s inputUri (bez mockScenario) vrátí platný výsledek', async () => {
    const r = await mockRecognitionService.recognize({
      inputUri: 'file:///tmp/scan.png',
      inputSource: 'gallery',
    });
    expect(['invoice', 'receipt', 'business_card']).toContain(r.suggestedType);
    expect(r.standardFields).toBeDefined();
    expect(r.transcript.trim().length).toBeGreaterThan(0);
  });
});
