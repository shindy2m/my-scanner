import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

/** Placeholder – naplní etapa 5 (R13–R16). */
export function HistoryScreen(_props: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Historie je zatím prázdná</Text>
      <Text style={styles.text}>
        Po dokončení skenů se tu zobrazí položky relace (etapa 3–5).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  text: { fontSize: 15, lineHeight: 22, color: '#475569' },
});
