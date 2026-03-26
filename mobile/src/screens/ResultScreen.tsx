import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
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
import {
  getConfiguredRecognitionService,
  getRecognitionBackend,
  getRecognitionLoadingHint,
  remapStandardFieldsForType,
  type RecognitionRequest,
  type RecognitionResult,
} from '../services/recognition';
import {
  grantNetworkRecognitionConsent,
  hasNetworkRecognitionConsent,
} from '../session/networkRecognitionConsent';
import { useSessionScans } from '../session/SessionScanContext';
import type { DocumentType } from '../types/document';
import { DOCUMENT_TYPE_LABELS } from '../types/document';
import { MIN_TOUCH_TARGET } from '../theme/accessibility';

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

export function ResultScreen({ route, navigation }: Props) {
  const params = route.params;
  const { addScan, updateScan } = useSessionScans();
  const previewUri = params.uri;
  const runKey = recognitionParamKey(params);

  const recognitionService = useMemo(
    () => getConfiguredRecognitionService(),
    []
  );
  const backend = useMemo(() => getRecognitionBackend(), []);
  const loadingHint = getRecognitionLoadingHint(backend);

  const [consentPhase, setConsentPhase] = useState<
    'loading' | 'prompt' | 'done'
  >(() => (backend === 'mock' ? 'done' : 'loading'));

  const [retryKey, setRetryKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawResult, setRawResult] = useState<RecognitionResult | null>(null);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);

  useEffect(() => {
    if (backend === 'mock') return;
    let cancelled = false;
    hasNetworkRecognitionConsent()
      .then((yes) => {
        if (!cancelled) {
          setConsentPhase(yes ? 'done' : 'prompt');
        }
      })
      .catch(() => {
        if (!cancelled) setConsentPhase('prompt');
      });
    return () => {
      cancelled = true;
    };
  }, [backend]);

  useEffect(() => {
    if (consentPhase !== 'done') {
      setLoading(consentPhase === 'loading');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setRawResult(null);
    setSelectedType(null);
    setCurrentScanId(null);

    const request = buildRecognitionRequest(params);
    recognitionService
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
      .catch((e: unknown) => {
        if (!cancelled) {
          if (e instanceof TypeError) {
            setError(
              'Nelze se spojit se sítí. Zkontrolujte připojení a zkuste to znovu.'
            );
          } else if (e instanceof Error) {
            setError(e.message);
          } else {
            setError('Nepodařilo se dokončit rozpoznání.');
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    runKey,
    retryKey,
    consentPhase,
    addScan,
    params.uri,
    params.source,
    recognitionService,
  ]);

  useEffect(() => {
    if (!rawResult || !currentScanId || selectedType === null) return;
    const fields = remapStandardFieldsForType(rawResult, selectedType);
    updateScan(currentScanId, {
      documentType: selectedType,
      standardFields: fields,
    });
  }, [rawResult, currentScanId, selectedType, updateScan]);

  const onRetry = () => {
    setRetryKey((k) => k + 1);
  };

  const onAcceptNetwork = async () => {
    await grantNetworkRecognitionConsent();
    setConsentPhase('done');
  };

  if (consentPhase === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1d4ed8" />
        <Text style={styles.muted}>Načítání…</Text>
      </View>
    );
  }

  if (consentPhase === 'prompt') {
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
        <View style={styles.consentCard}>
          <Text style={styles.consentTitle}>Odeslání dokumentu ke zpracování</Text>
          <Text style={styles.consentBody}>
            Pro rozpoznání textu bude tento obrázek odeslán mimo vaše zařízení ke
            zpracování (služba OpenAI nebo váš server přes proxy). Obsah zpracování
            podléhá podmínkám poskytovatele služby.
          </Text>
          <Text style={styles.consentBody}>
            Pokud pokračujete, berete toto odeslání na vědomí. Historie skenů zůstává
            jen v paměti této relace aplikace.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Souhlasím s odesláním dokumentu ke zpracování"
            onPress={() => {
              void onAcceptNetwork();
            }}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.primaryBtnPressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>Souhlasím a pokračovat</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.secondaryBtnPressed,
            ]}
          >
            <Text style={styles.secondaryBtnText}>Zpět</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

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
          <Text style={styles.loadingHint}>{loadingHint}</Text>
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zkusit rozpoznání znovu"
          onPress={onRetry}
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && styles.primaryBtnPressed,
            { marginTop: 8 },
          ]}
        >
          <Text style={styles.primaryBtnText}>Zkusit znovu</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.secondaryBtn,
            pressed && styles.secondaryBtnPressed,
          ]}
        >
          <Text style={styles.secondaryBtnText}>Zpět</Text>
        </Pressable>
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
  consentCard: {
    padding: 18,
    gap: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  consentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  consentBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
  primaryBtn: {
    minHeight: MIN_TOUCH_TARGET,
    borderRadius: 10,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryBtnPressed: { opacity: 0.88 },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    minHeight: MIN_TOUCH_TARGET,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  secondaryBtnPressed: { opacity: 0.88 },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
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
  error: { color: '#b91c1c', textAlign: 'center', marginBottom: 4 },
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
