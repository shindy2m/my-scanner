import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import type { RecognitionMockScenario } from '../services/recognition';
import { DOCUMENT_TYPE_LABELS, type DocumentType } from '../types/document';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const DEMO_TYPES: DocumentType[] = ['invoice', 'receipt', 'business_card'];

export function HomeScreen({ navigation }: Props) {
  const goResult = (scenario: RecognitionMockScenario) => {
    navigation.navigate('Result', { scenario });
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.lead}>
        Etapa 1: navigace a mock rozpoznání (bez kamery). Vyberte typ ukázkového výsledku.
      </Text>

      <Pressable
        style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.primaryLabel}>Historie</Text>
      </Pressable>

      <Text style={styles.section}>Ukázkový výsledek podle typu</Text>
      {DEMO_TYPES.map((t) => (
        <Pressable
          key={t}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
          onPress={() => goResult(t)}
        >
          <Text style={styles.secondaryLabel}>{DOCUMENT_TYPE_LABELS[t]}</Text>
        </Pressable>
      ))}

      <Pressable
        style={({ pressed }) => [styles.tertiary, pressed && styles.pressed]}
        onPress={() => goResult('uncertain')}
      >
        <Text style={styles.tertiaryLabel}>Nejistý návrh typu (mock R6)</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  lead: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
    color: '#333',
  },
  section: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  primary: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondary: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  secondaryLabel: { fontSize: 16, color: '#0f172a' },
  tertiary: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
  },
  tertiaryLabel: { fontSize: 15, color: '#92400e' },
  pressed: { opacity: 0.85 },
});
