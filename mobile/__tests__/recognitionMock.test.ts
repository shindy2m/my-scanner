import {
  buildMockResultForType,
  getStandardFieldKeys,
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

  it('oddělí shrnutí a tělo přepisu (R9)', () => {
    const result = buildMockResultForType('invoice');
    expect(result.transcript.summary.length).toBeGreaterThan(0);
    expect(result.transcript.body.length).toBeGreaterThan(0);
    expect(result.transcript.summary).not.toBe(result.transcript.body);
  });

  it('nejistý scénář má nízkou jistotu typu', () => {
    const r = resolveMockScenario('uncertain');
    expect(r.typeConfidence).toBe('low');
  });
});
