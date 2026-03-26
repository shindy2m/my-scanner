import { StyleSheet, Text, View } from 'react-native';

/**
 * E6 / PRD § 4 – znění pro demo: mock lokálně vs. budoucí odeslání obsahu (E7).
 */
export function PrivacyNotice() {
  return (
    <View style={styles.box}>
      <Text style={styles.title} accessibilityRole="header">
        Jak se v této verzi pracuje s daty
      </Text>
      <Text style={styles.p}>
        Ukázková verze používá{' '}
        <Text style={styles.strong}>simulované rozpoznání</Text> v aplikaci –
        obrázek se kvůli tomu neodesílá na síť a výstup je předpřipravený text
        pro demo.
      </Text>
      <Text style={styles.p}>
        Položky historie jsou jen v paměti této relace; po zavření aplikace se
        neobnoví.
      </Text>
      <Text style={styles.p}>
        V plné verzi s OpenAI bude obsah dokumentu při rozpoznání odeslán mimo
        zařízení. Před zapnutím této funkce budete v aplikaci výslovně
        informováni, v souladu s produktovými požadavky.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 8,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  p: {
    fontSize: 14,
    lineHeight: 21,
    color: '#334155',
  },
  strong: { fontWeight: '700', color: '#0f172a' },
});
