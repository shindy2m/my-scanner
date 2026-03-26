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
import type { HistoryStackParamList } from '../navigation/types';
import {
  filterSessionItems,
  type HistoryFilter,
} from '../session/filterSessionItems';
import { useSessionScans } from '../session/SessionScanContext';
import { MIN_TOUCH_TARGET } from '../theme/accessibility';
import { j } from '../theme/jablotron';
import { DOCUMENT_TYPE_LABELS } from '../types/document';

type Props = NativeStackScreenProps<HistoryStackParamList, 'History'>;

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
  box: { flex: 1, padding: j.space[5], justifyContent: 'center' },
  scroll: { padding: j.space[4], paddingBottom: j.space[8] },
  title: {
    fontSize: j.font.lg,
    fontWeight: j.weight.semibold,
    marginBottom: j.space[2],
    color: j.text.primary,
  },
  caption: {
    fontSize: j.font.sm,
    color: j.text.secondary,
    marginBottom: j.space[3],
  },
  text: {
    fontSize: j.font.sm + 1,
    lineHeight: 22,
    color: j.text.secondary,
  },
  filterLabel: {
    fontSize: j.font.sm - 1,
    fontWeight: j.weight.semibold,
    color: j.text.secondary,
    marginBottom: j.space[2],
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: j.space[2],
    marginBottom: j.space[4],
  },
  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: j.radius.lg,
    borderWidth: 2,
    borderColor: j.border.action,
    backgroundColor: j.surface.gray,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  filterChipSelected: {
    borderColor: j.border.selected,
    backgroundColor: j.bg.warning,
  },
  filterChipText: { fontSize: j.font.sm, color: j.text.primary },
  filterChipTextSel: { fontWeight: j.weight.bold, color: j.text.primary },
  emptyFilter: {
    fontSize: j.font.sm,
    color: j.text.tertiary,
    marginBottom: j.space[3],
  },
  card: {
    backgroundColor: j.surface.base,
    borderRadius: j.radius.lg,
    borderWidth: 1,
    borderColor: j.border.primary,
    padding: j.space[3],
    marginBottom: j.space[3],
  },
  cardPressed: { opacity: 0.92 },
  thumb: {
    width: '100%',
    height: 100,
    borderRadius: j.radius.md,
    backgroundColor: j.bg.action,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: j.font.base,
    fontWeight: j.weight.bold,
    color: j.text.primary,
  },
  meta: { fontSize: j.font.xs, color: j.text.tertiary, marginTop: j.space[1] },
  previewText: {
    fontSize: j.font.sm,
    color: j.text.secondary,
    marginTop: j.space[2],
    lineHeight: 20,
  },
});
