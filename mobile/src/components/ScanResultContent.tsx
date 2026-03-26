import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getStandardFieldDefinitions } from '../services/recognition';
import { j } from '../theme/jablotron';
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
  scroll: { padding: j.space[4], paddingBottom: j.space[8] },
  previewThumb: {
    width: '100%',
    maxHeight: 160,
    minHeight: 100,
    backgroundColor: j.bg.action,
    borderRadius: j.radius.lg,
    marginBottom: j.space[4],
  },
  h2: {
    fontSize: j.font.lg - 1,
    fontWeight: j.weight.bold,
    marginTop: j.space[2],
    marginBottom: 10,
    color: j.text.primary,
  },
  h2AfterFields: { marginTop: j.space[5] },
  row: { marginBottom: 10 },
  label: {
    fontSize: j.font.sm - 1,
    color: j.text.secondary,
    marginBottom: 2,
    fontWeight: j.weight.medium,
  },
  value: { fontSize: j.font.base, color: j.text.primary },
  body: {
    fontSize: j.font.base,
    lineHeight: 24,
    color: j.text.primary,
  },
  footerWrap: { marginTop: 28, paddingTop: j.space[2] },
});
