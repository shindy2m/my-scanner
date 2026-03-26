import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import {
  getStandardFieldDefinitions,
  mockRecognitionService,
  type RecognitionResult,
} from '../services/recognition';
import { DOCUMENT_TYPE_LABELS } from '../types/document';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export function ResultScreen({ route }: Props) {
  const { scenario } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecognitionResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    mockRecognitionService
      .recognize({ mockScenario: scenario })
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .catch(() => {
        if (!cancelled) setError('Nepodařilo se dokončit mock rozpoznání.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [scenario]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Probíhá mock rozpoznání…</Text>
      </View>
    );
  }

  if (error || !result) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error ?? 'Neznámá chyba'}</Text>
      </View>
    );
  }

  const typeLabel = DOCUMENT_TYPE_LABELS[result.suggestedType];
  const fields = getStandardFieldDefinitions(result.suggestedType);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.typeLine}>
        Navržený typ: <Text style={styles.bold}>{typeLabel}</Text>
        {result.typeConfidence === 'low' ? (
          <Text style={styles.warn}> (nízká jistota)</Text>
        ) : null}
      </Text>

      <Text style={styles.h2}>Standardní údaje</Text>
      {fields.map(({ key, label }) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>
            {result.standardFields[key]?.trim()
              ? result.standardFields[key]
              : '—'}
          </Text>
        </View>
      ))}

      <Text style={styles.h2}>Přepis</Text>
      <Text style={styles.subh}>Shrnutí</Text>
      <Text style={styles.body}>{result.transcript.summary}</Text>
      <View style={styles.divider} />
      <Text style={styles.subh}>Další rozpoznaný text</Text>
      <Text style={styles.body}>{result.transcript.body}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  muted: { color: '#64748b', marginTop: 8 },
  error: { color: '#b91c1c', textAlign: 'center' },
  typeLine: { fontSize: 16, marginBottom: 16 },
  bold: { fontWeight: '700' },
  warn: { color: '#b45309' },
  h2: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
  },
  subh: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  row: { marginBottom: 10 },
  label: { fontSize: 12, color: '#64748b', marginBottom: 2 },
  value: { fontSize: 16, color: '#0f172a' },
  body: { fontSize: 15, lineHeight: 22, color: '#1e293b' },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 14,
  },
});
