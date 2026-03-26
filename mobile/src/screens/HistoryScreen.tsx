import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { useSessionScans } from '../session/SessionScanContext';
import { DOCUMENT_TYPE_LABELS } from '../types/document';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

/** Etapa 3: náhled relace (R10). Plný seznam a filtry v etapě 5. */
export function HistoryScreen(_props: Props) {
  const { items } = useSessionScans();

  if (items.length === 0) {
    return (
      <View style={styles.box}>
        <Text style={styles.title}>Historie je zatím prázdná</Text>
        <Text style={styles.text}>
          Po úspěšném skenu z domovské obrazovky se tu objeví položky relace
          (nejnovější nahoře).
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.caption}>{items.length} položek v této relaci</Text>
      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          {item.previewUri ? (
            <Image
              accessibilityLabel="Náhled skenu"
              source={{ uri: item.previewUri }}
              style={styles.thumb}
              resizeMode="cover"
            />
          ) : null}
          <Text style={styles.cardTitle}>
            {DOCUMENT_TYPE_LABELS[item.documentType]}
          </Text>
          <Text style={styles.meta}>
            {new Date(item.scannedAt).toLocaleString('cs-CZ')}
          </Text>
          <Text style={styles.previewText} numberOfLines={2}>
            {item.transcript}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 20, justifyContent: 'center' },
  scroll: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  caption: { fontSize: 14, color: '#64748b', marginBottom: 12 },
  text: { fontSize: 15, lineHeight: 22, color: '#475569' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 12,
  },
  thumb: {
    width: '100%',
    height: 100,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  meta: { fontSize: 12, color: '#64748b', marginTop: 4 },
  previewText: { fontSize: 14, color: '#334155', marginTop: 8, lineHeight: 20 },
});
