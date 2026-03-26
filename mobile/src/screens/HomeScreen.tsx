import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  pickFromCamera,
  pickFromGallery,
  pickImageFile,
} from '../input/pickDocumentImage';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const runPick = useCallback(
    async (
      pick: () => Promise<{ uri: string; source: 'camera' | 'gallery' | 'file' } | null>
    ) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      try {
        const picked = await pick();
        if (picked) {
          navigation.navigate('Result', {
            uri: picked.uri,
            source: picked.source,
          });
        }
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [navigation]
  );

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.lead}>
        Naskenujte nebo vyberte obrázek dokumentu — náhled a rozpoznání (mock) se spustí
        automaticky.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.primary,
          pressed && styles.pressed,
          busy && styles.disabled,
        ]}
        disabled={busy}
        onPress={() => runPick(pickFromCamera)}
      >
        <Text style={styles.primaryLabel}>Pořídit snímek kamerou</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.primary,
          pressed && styles.pressed,
          busy && styles.disabled,
        ]}
        disabled={busy}
        onPress={() => runPick(pickFromGallery)}
      >
        <Text style={styles.primaryLabel}>Vybrat z galerie</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.primary,
          pressed && styles.pressed,
          busy && styles.disabled,
        ]}
        disabled={busy}
        onPress={() => runPick(pickImageFile)}
      >
        <Text style={styles.primaryLabel}>Vybrat obrázek ze souboru</Text>
      </Pressable>

      {busy ? (
        <Text style={styles.busyHint}>Otevírám výběr…</Text>
      ) : null}

      <View style={styles.divider} />

      <Pressable
        style={({ pressed }) => [styles.secondaryNav, pressed && styles.pressed]}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.secondaryNavLabel}>Historie</Text>
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
  primary: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.55 },
  busyHint: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  secondaryNav: {
    borderWidth: 1,
    borderColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryNavLabel: { fontSize: 16, fontWeight: '600', color: '#2563eb' },
  pressed: { opacity: 0.85 },
});
