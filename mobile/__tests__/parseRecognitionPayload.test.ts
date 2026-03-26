import {
  normalizeRecognitionPayload,
  parseRecognitionJsonString,
} from '../src/services/recognition/parseRecognitionPayload';

describe('parseRecognitionPayload', () => {
  it('normalizuje platný invoice payload', () => {
    const r = normalizeRecognitionPayload({
      suggestedType: 'invoice',
      typeConfidence: 'high',
      standardFields: {
        invoiceNumber: 'FV-1',
        issueDate: '2025-01-01',
      },
      transcript: 'Celý text',
    });
    expect(r.suggestedType).toBe('invoice');
    expect(r.typeConfidence).toBe('high');
    expect(r.transcript).toBe('Celý text');
    expect(r.standardFields).toHaveProperty('supplierName');
    expect(r.standardFields).toHaveProperty('totalVat');
  });

  it('parsuje JSON s markdown ploty', () => {
    const r = parseRecognitionJsonString(
      '```json\n{"suggestedType":"receipt","typeConfidence":"low","standardFields":{"merchant":"A"},"transcript":"x"}\n```'
    );
    expect(r.suggestedType).toBe('receipt');
    expect(r.typeConfidence).toBe('low');
  });

  it('vyhodí při neplatném typu', () => {
    expect(() =>
      normalizeRecognitionPayload({
        suggestedType: 'other',
        standardFields: {},
        transcript: 't',
      })
    ).toThrow();
  });
});
