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
import { ScanResultContent } from '../components/ScanResultContent';
import type { RootStackParamList } from '../navigation/types';
import { MIN_TOUCH_TARGET } from '../theme/accessibility';
import {
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
        <View
          style={styles.loadingCard}
          accessible={true}
          accessibilityRole="progressbar"
          accessibilityLabel="Probíhá rozpoznání dokumentu, čekejte prosím"
          accessibilityState={{ busy: true }}
        >
          <ActivityIndicator size="large" color="#1d4ed8" />
          <Text style={styles.loadingTitle}>Zpracovává se dokument</Text>
          <Text style={styles.loadingHint}>
            Simulované rozpoznání běží na zařízení (ukázkový režim).
          </Text>
          <Text
            style={styles.muted}
            accessibilityLiveRegion="polite"
          >
            Čekejte prosím…
          </Text>
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
        <Text style={styles.error} accessibilityRole="alert">
          {error ?? 'Neznámá chyba'}
        </Text>
      </View>
    );
  }

  const suggestedLabel = DOCUMENT_TYPE_LABELS[rawResult.suggestedType];
  const displayFields = remapStandardFieldsForType(rawResult, selectedType);

  const beforeStandardFields = (
    <>
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
    </>
  );

  return (
    <ScanResultContent
      previewUri={previewUri}
      beforeStandardFields={beforeStandardFields}
      documentType={selectedType}
      standardFields={displayFields}
      transcript={rawResult.transcript}
    />
  );
}

const styles = StyleSheet.create({
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
  previewError: {
    width: '100%',
    maxHeight: 200,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 16,
  },
  loadingCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  loadingHint: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  muted: { color: '#475569', marginTop: 4, fontSize: 15, fontWeight: '600' },
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
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94a3b8',
    backgroundColor: '#f8fafc',
    minWidth: '30%',
    flexGrow: 1,
    maxWidth: '100%',
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  typeChipSelected: {
    borderColor: '#0f172a',
    backgroundColor: '#e2e8f0',
  },
  typeChipText: {
    fontSize: 14,
    color: '#1e293b',
    textAlign: 'center',
  },
  typeChipTextSel: { fontWeight: '700', color: '#0f172a' },
  h2: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
  },
});
