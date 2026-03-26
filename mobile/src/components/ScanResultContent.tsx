import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getStandardFieldDefinitions } from '../services/recognition';
import type { DocumentType } from '../types/document';

type Props = {
  previewUri: string | null;
  /** Klepnutí = plný náhled (E5 / R15); bez callbacku jen zobrazení. */
  onPreviewPress?: () => void;
  beforeStandardFields?: ReactNode;
  /** Volitelný blok pod přepisem (např. mazání z historie). */
  footer?: ReactNode;
  documentType: DocumentType;
  standardFields: Record<string, string>;
  transcript: string;
};

export function ScanResultContent({
  previewUri,
  onPreviewPress,
  beforeStandardFields,
  footer,
  documentType,
  standardFields,
  transcript,
}: Props) {
  const fields = getStandardFieldDefinitions(documentType);
  const fullTranscript = transcript.trim();

  const preview = previewUri ? (
    <Pressable
      disabled={!onPreviewPress}
      onPress={onPreviewPress}
      accessibilityRole={onPreviewPress ? 'button' : undefined}
      accessibilityLabel={
        onPreviewPress
          ? 'Otevřít náhled v plném rozlišení'
          : 'Náhled vybraného dokumentu'
      }
    >
      <Image
        accessibilityLabel="Náhled vybraného dokumentu"
        source={{ uri: previewUri }}
        style={styles.previewThumb}
        resizeMode="contain"
      />
    </Pressable>
  ) : null;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {preview}
      {beforeStandardFields}

      <Text style={styles.h2}>Standardní údaje</Text>
      {fields.map(({ key, label }) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>
            {standardFields[key]?.trim() ? standardFields[key] : '—'}
          </Text>
        </View>
      ))}

      <Text style={[styles.h2, styles.h2AfterFields]}>Kompletní přepis</Text>
      <Text
        style={styles.body}
        accessibilityRole="text"
        accessibilityLabel="Kompletní přepis dokumentu"
      >
        {fullTranscript ? transcript : '—'}
      </Text>
      {footer ? <View style={styles.footerWrap}>{footer}</View> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  previewThumb: {
    width: '100%',
    maxHeight: 160,
    minHeight: 100,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 16,
  },
  h2: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
  },
  h2AfterFields: { marginTop: 20 },
  row: { marginBottom: 10 },
  label: { fontSize: 13, color: '#475569', marginBottom: 2, fontWeight: '500' },
  value: { fontSize: 16, color: '#0f172a' },
  body: { fontSize: 16, lineHeight: 24, color: '#1e293b' },
  footerWrap: { marginTop: 28, paddingTop: 8 },
});
