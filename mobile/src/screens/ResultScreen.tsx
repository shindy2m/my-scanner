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
import type { HomeStackParamList } from '../navigation/types';
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
import { j } from '../theme/jablotron';

const DOCUMENT_TYPES: DocumentType[] = [
  'invoice',
  'receipt',
  'business_card',
];

type Props = NativeStackScreenProps<HomeStackParamList, 'Result'>;

function recognitionParamKey(params: HomeStackParamList['Result']): string {
  return `${params.uri}:${params.source}`;
}

function buildRecognitionRequest(
  params: HomeStackParamList['Result']
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
        <ActivityIndicator size="large" color={j.button.blue} />
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
          <ActivityIndicator size="large" color={j.button.blue} />
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
    padding: j.space[4],
    paddingBottom: j.space[8],
    flexGrow: 1,
  },
  preview: {
    width: '100%',
    maxHeight: 280,
    minHeight: 160,
    backgroundColor: j.bg.action,
    borderRadius: j.radius.lg,
    marginBottom: j.space[5],
  },
  previewError: {
    width: '100%',
    maxHeight: 200,
    backgroundColor: j.bg.action,
    borderRadius: j.radius.lg,
    marginBottom: j.space[4],
  },
  loadingCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: j.space[5],
    gap: 10,
    backgroundColor: j.bg.action,
    borderRadius: j.radius.xl,
    borderWidth: 1,
    borderColor: j.border.primary,
  },
  consentCard: {
    padding: 18,
    gap: 14,
    backgroundColor: j.surface.base,
    borderRadius: j.radius.xl,
    borderWidth: 1,
    borderColor: j.border.primary,
  },
  consentTitle: {
    fontSize: j.font.lg,
    fontWeight: j.weight.bold,
    color: j.text.primary,
  },
  consentBody: {
    fontSize: j.font.sm + 1,
    lineHeight: 22,
    color: j.text.secondary,
  },
  primaryBtn: {
    minHeight: MIN_TOUCH_TARGET,
    borderRadius: j.radius.lg,
    backgroundColor: j.button.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: j.space[4],
  },
  primaryBtnPressed: { backgroundColor: j.button.primaryPress },
  primaryBtnText: {
    color: j.text.primary,
    fontSize: j.font.base,
    fontWeight: j.weight.bold,
  },
  secondaryBtn: {
    minHeight: MIN_TOUCH_TARGET,
    borderRadius: j.radius.lg,
    borderWidth: 2,
    borderColor: j.border.action,
    backgroundColor: j.button.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: j.space[4],
  },
  secondaryBtnPressed: { opacity: 0.88 },
  secondaryBtnText: {
    fontSize: j.font.base,
    fontWeight: j.weight.semibold,
    color: j.text.primary,
  },
  loadingTitle: {
    fontSize: j.font.lg,
    fontWeight: j.weight.bold,
    color: j.text.primary,
    textAlign: 'center',
  },
  loadingHint: {
    fontSize: j.font.sm,
    lineHeight: 20,
    color: j.text.secondary,
    textAlign: 'center',
    paddingHorizontal: j.space[2],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: j.space[6],
    gap: j.space[3],
  },
  muted: {
    color: j.text.secondary,
    marginTop: j.space[1],
    fontSize: j.font.sm + 1,
    fontWeight: j.weight.semibold,
  },
  error: {
    color: j.text.negative,
    textAlign: 'center',
    marginBottom: j.space[1],
  },
  typeLine: {
    fontSize: j.font.base,
    marginBottom: j.space[3],
    color: j.text.primary,
  },
  bold: { fontWeight: j.weight.bold },
  warn: { color: j.text.warning },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: j.space[2],
    marginBottom: j.space[2],
  },
  typeChip: {
    paddingVertical: j.space[3],
    paddingHorizontal: j.space[3],
    borderRadius: j.radius.lg,
    borderWidth: 2,
    borderColor: j.border.action,
    backgroundColor: j.surface.gray,
    minWidth: '30%',
    flexGrow: 1,
    maxWidth: '100%',
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  typeChipSelected: {
    borderColor: j.border.selected,
    backgroundColor: j.bg.warning,
  },
  typeChipText: {
    fontSize: j.font.sm,
    color: j.text.primary,
    textAlign: 'center',
  },
  typeChipTextSel: { fontWeight: j.weight.bold, color: j.text.primary },
  h2: {
    fontSize: j.font.lg - 1,
    fontWeight: j.weight.bold,
    marginTop: j.space[2],
    marginBottom: 10,
    color: j.text.primary,
  },
});
