import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  pickFromCamera,
  pickFromGallery,
  pickImageFile,
} from '../input/pickDocumentImage';
import type { RootStackParamList } from '../navigation/types';
import { MIN_TOUCH_TARGET } from '../theme/accessibility';

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
        Vyberte doklad — fakturu, účtenku z obchodu nebo vizitku.
        {'\n\n'}
        Můžete ho vyfotit, nahrát z galerie nebo ze souboru.
      </Text>

      <Image
        source={require('../../assets/home-input-hero.png')}
        style={styles.hero}
        resizeMode="contain"
        accessibilityLabel="Kamera, galerie a soubor jako způsoby nahrání dokladu"
        accessible={true}
      />

      <Pressable
        style={({ pressed }) => [
          styles.primary,
          pressed && styles.pressed,
          busy && styles.disabled,
        ]}
        disabled={busy}
        onPress={() => runPick(pickFromCamera)}
        accessibilityHint="Otevře kameru a po snímku spustí rozpoznání"
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
        accessibilityHint="Otevře galerii, po výběru obrázku spustí rozpoznání"
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
        accessibilityHint="Otevře výběr souboru, po výběru obrázku spustí rozpoznání"
      >
        <Text style={styles.primaryLabel}>Vybrat obrázek ze souboru</Text>
      </Pressable>

      {busy ? (
        <Text
          style={styles.busyHint}
          accessibilityLiveRegion="polite"
          accessibilityLabel="Otevírám výběr, čekejte prosím"
        >
          Otevírám výběr…
        </Text>
      ) : null}

      <View style={styles.divider} />

      <Pressable
        style={({ pressed }) => [styles.secondaryNav, pressed && styles.pressed]}
        onPress={() => navigation.navigate('History')}
        accessibilityRole="button"
        accessibilityLabel="Historie skenů v této relaci"
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
    marginBottom: 12,
    color: '#1e293b',
  },
  hero: {
    width: '100%',
    maxHeight: 200,
    minHeight: 140,
    marginBottom: 8,
    alignSelf: 'center',
  },
  primary: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
  },
  primaryLabel: { color: '#ffffff', fontSize: 17, fontWeight: '600' },
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
    borderWidth: 2,
    borderColor: '#1d4ed8',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
  },
  secondaryNavLabel: { fontSize: 17, fontWeight: '600', color: '#1e40af' },
  pressed: { opacity: 0.85 },
});
