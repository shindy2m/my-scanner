import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import {
  getStandardFieldDefinitions,
  mockRecognitionService,
  remapStandardFieldsForType,
  type RecognitionRequest,
  type RecognitionResult,
} from '../services/recognition';
import { useSessionScans } from '../session/SessionScanContext';
import type { DocumentType } from '../types/document';
import { DOCUMENT_TYPE_LABELS } from '../types/document';

const DOCUMENT_TYPES: DocumentType[] = [
  'invoice',
  'receipt',
  'business_card',
];

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
  const { addScan, updateScan } = useSessionScans();
  const previewUri = params.uri;
  const runKey = recognitionParamKey(params);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawResult, setRawResult] = useState<RecognitionResult | null>(null);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setRawResult(null);
    setSelectedType(null);
    setCurrentScanId(null);
    const request = buildRecognitionRequest(route.params);
    mockRecognitionService
      .recognize(request)
      .then((r) => {
        if (!cancelled) {
          setRawResult(r);
          setSelectedType(r.suggestedType);
          const id = addScan({
            result: r,
            previewUri: params.uri,
            inputSource: params.source,
          });
          setCurrentScanId(id);
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
  }, [runKey, addScan, params.uri, params.source]);

  useEffect(() => {
    if (!rawResult || !currentScanId || selectedType === null) return;
    const fields = remapStandardFieldsForType(rawResult, selectedType);
    updateScan(currentScanId, {
      documentType: selectedType,
      standardFields: fields,
    });
  }, [rawResult, currentScanId, selectedType, updateScan]);

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

  if (error || !rawResult || selectedType === null) {
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

  const suggestedLabel = DOCUMENT_TYPE_LABELS[rawResult.suggestedType];
  const displayFields = remapStandardFieldsForType(rawResult, selectedType);
  const fields = getStandardFieldDefinitions(selectedType);
  const fullTranscript = rawResult.transcript.trim();

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
        Návrh systému: <Text style={styles.bold}>{suggestedLabel}</Text>
        {rawResult.typeConfidence === 'low' ? (
          <Text style={styles.warn}> (nízká jistota – zkontrolujte typ)</Text>
        ) : null}
      </Text>

      <Text style={styles.h2}>Typ dokumentu</Text>
      <View
        style={styles.typeRow}
        accessibilityRole="radiogroup"
        accessibilityLabel="Výběr typu dokumentu"
      >
        {DOCUMENT_TYPES.map((t) => {
          const selected = selectedType === t;
          return (
            <Pressable
              key={t}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setSelectedType(t)}
              style={[styles.typeChip, selected && styles.typeChipSelected]}
            >
              <Text
                style={[styles.typeChipText, selected && styles.typeChipTextSel]}
                numberOfLines={2}
              >
                {DOCUMENT_TYPE_LABELS[t]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.h2}>Standardní údaje</Text>
      {fields.map(({ key, label }) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>
            {displayFields[key]?.trim() ? displayFields[key] : '—'}
          </Text>
        </View>
      ))}

      <Text style={[styles.h2, styles.h2AfterFields]}>Kompletní přepis</Text>
      <Text
        style={styles.body}
        accessibilityRole="text"
        accessibilityLabel="Kompletní přepis dokumentu"
      >
        {fullTranscript ? rawResult.transcript : '—'}
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
  typeLine: { fontSize: 16, marginBottom: 12 },
  bold: { fontWeight: '700' },
  warn: { color: '#b45309' },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  typeChip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    minWidth: '30%',
    flexGrow: 1,
    maxWidth: '100%',
  },
  typeChipSelected: {
    borderColor: '#0f172a',
    backgroundColor: '#e2e8f0',
  },
  typeChipText: {
    fontSize: 13,
    color: '#334155',
    textAlign: 'center',
  },
  typeChipTextSel: { fontWeight: '700', color: '#0f172a' },
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
