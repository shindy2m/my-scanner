import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import {
  getStandardFieldDefinitions,
  mockRecognitionService,
  type RecognitionRequest,
  type RecognitionResult,
} from '../services/recognition';
import { useSessionScans } from '../session/SessionScanContext';
import { DOCUMENT_TYPE_LABELS } from '../types/document';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

function recognitionParamKey(params: RootStackParamList['Result']): string {
  return `${params.uri}:${params.source}`;
}

function buildRecognitionRequest(
  params: RootStackParamList['Result']
): RecognitionRequest {
  return { inputUri: params.uri, inputSource: params.source };
}

export function ResultScreen({ route }: Props) {
  const params = route.params;
  const { addScan } = useSessionScans();
  const previewUri = params.uri;
  const runKey = recognitionParamKey(params);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecognitionResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const request = buildRecognitionRequest(route.params);
    mockRecognitionService
      .recognize(request)
      .then((r) => {
        if (!cancelled) {
          setResult(r);
          addScan({
            result: r,
            previewUri: params.uri,
            inputSource: params.source,
          });
        }
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
  }, [runKey, addScan]);

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.scrollLoading}>
        {previewUri ? (
          <Image
            accessibilityLabel="Náhled vybraného dokumentu"
            source={{ uri: previewUri }}
            style={styles.preview}
            resizeMode="contain"
          />
        ) : null}
        <View style={styles.loadingBlock}>
          <ActivityIndicator size="large" />
          <Text style={styles.muted}>Probíhá mock rozpoznání…</Text>
        </View>
      </ScrollView>
    );
  }

  if (error || !result) {
    return (
      <View style={styles.centered}>
        {previewUri ? (
          <Image
            accessibilityLabel="Náhled vybraného dokumentu"
            source={{ uri: previewUri }}
            style={styles.previewError}
            resizeMode="contain"
          />
        ) : null}
        <Text style={styles.error}>{error ?? 'Neznámá chyba'}</Text>
      </View>
    );
  }

  const typeLabel = DOCUMENT_TYPE_LABELS[result.suggestedType];
  const fields = getStandardFieldDefinitions(result.suggestedType);
  const fullTranscript = result.transcript.trim();

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {previewUri ? (
        <Image
          accessibilityLabel="Náhled vybraného dokumentu"
          source={{ uri: previewUri }}
          style={styles.previewThumb}
          resizeMode="contain"
        />
      ) : null}

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

      <Text style={[styles.h2, styles.h2AfterFields]}>Kompletní přepis</Text>
      <Text
        style={styles.body}
        accessibilityRole="text"
        accessibilityLabel="Kompletní přepis dokumentu"
      >
        {fullTranscript ? result.transcript : '—'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  scrollLoading: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  preview: {
    width: '100%',
    maxHeight: 280,
    minHeight: 160,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 20,
  },
  previewThumb: {
    width: '100%',
    maxHeight: 160,
    minHeight: 100,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 16,
  },
  previewError: {
    width: '100%',
    maxHeight: 200,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 16,
  },
  loadingBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 12,
  },
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
  h2AfterFields: { marginTop: 20 },
  row: { marginBottom: 10 },
  label: { fontSize: 12, color: '#64748b', marginBottom: 2 },
  value: { fontSize: 16, color: '#0f172a' },
  body: { fontSize: 15, lineHeight: 22, color: '#1e293b' },
});
