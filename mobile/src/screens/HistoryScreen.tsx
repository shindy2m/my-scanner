import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import {
  filterSessionItems,
  type HistoryFilter,
} from '../session/filterSessionItems';
import { useSessionScans } from '../session/SessionScanContext';
import { MIN_TOUCH_TARGET } from '../theme/accessibility';
import { DOCUMENT_TYPE_LABELS } from '../types/document';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

const FILTER_CHIPS: { key: HistoryFilter; label: string }[] = [
  { key: 'all', label: 'Vše' },
  { key: 'invoice', label: DOCUMENT_TYPE_LABELS.invoice },
  { key: 'receipt', label: DOCUMENT_TYPE_LABELS.receipt },
  {
    key: 'business_card',
    label: DOCUMENT_TYPE_LABELS.business_card,
  },
];

export function HistoryScreen({ navigation }: Props) {
  const { items } = useSessionScans();
  const [filter, setFilter] = useState<HistoryFilter>('all');

  const filtered = useMemo(
    () => filterSessionItems(items, filter),
    [items, filter]
  );

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
      <Text style={styles.caption}>
        {items.length} položek v relaci
        {filter !== 'all'
          ? ` · zobrazeno ${filtered.length}`
          : ''}
      </Text>

      <Text style={styles.filterLabel}>Filtrovat podle typu</Text>
      <View
        style={styles.filterRow}
        accessibilityRole="tablist"
        accessibilityLabel="Filtr typu dokumentu"
      >
        {FILTER_CHIPS.map(({ key, label }) => {
          const selected = filter === key;
          return (
            <Pressable
              key={key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setFilter(key)}
              style={[styles.filterChip, selected && styles.filterChipSelected]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selected && styles.filterChipTextSel,
                ]}
                numberOfLines={2}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <Text style={styles.emptyFilter}>
          Pro tento filtr zatím nemáte žádnou položku.
        </Text>
      ) : null}

      {filtered.map((item) => (
        <Pressable
          key={item.id}
          onPress={() =>
            navigation.navigate('HistoryDetail', { scanId: item.id })
          }
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          accessibilityRole="button"
          accessibilityLabel={`Detail skenu ${DOCUMENT_TYPE_LABELS[item.documentType]}`}
        >
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
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 20, justifyContent: 'center' },
  scroll: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  caption: { fontSize: 14, color: '#475569', marginBottom: 12 },
  text: { fontSize: 15, lineHeight: 22, color: '#475569' },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94a3b8',
    backgroundColor: '#f8fafc',
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  filterChipSelected: {
    borderColor: '#0f172a',
    backgroundColor: '#e2e8f0',
  },
  filterChipText: { fontSize: 14, color: '#1e293b' },
  filterChipTextSel: { fontWeight: '700', color: '#0f172a' },
  emptyFilter: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 12,
  },
  cardPressed: { opacity: 0.92 },
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
