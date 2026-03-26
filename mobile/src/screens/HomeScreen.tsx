import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  pickFromCamera,
  pickFromGallery,
  pickImageFile,
} from '../input/pickDocumentImage';
import type { HomeStackParamList } from '../navigation/types';
import { MIN_TOUCH_TARGET } from '../theme/accessibility';
import { j } from '../theme/jablotron';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

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
        Můžete ho vyfotit, nahrát z galerie nebo ze souboru. Historii relace
        otevřete v menu vpravo nahoře.
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: j.space[5],
    paddingBottom: j.space[10],
    gap: j.space[3],
  },
  lead: {
    fontSize: j.font.sm + 1,
    lineHeight: j.space[5],
    marginBottom: j.space[3],
    color: j.text.primary,
  },
  hero: {
    width: '100%',
    maxHeight: 200,
    minHeight: 140,
    marginBottom: j.space[2],
    alignSelf: 'center',
  },
  primary: {
    backgroundColor: j.button.primary,
    paddingVertical: j.space[4],
    paddingHorizontal: j.space[4],
    borderRadius: j.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
  },
  primaryLabel: {
    color: j.text.primary,
    fontSize: j.font.lg - 1,
    fontWeight: j.weight.semibold,
  },
  disabled: { opacity: 0.55 },
  busyHint: {
    fontSize: j.font.sm - 1,
    color: j.text.secondary,
    textAlign: 'center',
  },
  pressed: { backgroundColor: j.button.primaryPress },
});
