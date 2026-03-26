import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWindowDimensions, Image, StyleSheet, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FullImage'>;

/** Náhled vstupu v plném rozlišení (R15) – bez umělého zmenšení výšky. */
export function FullImageScreen({ route }: Props) {
  const { uri } = route.params;
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.root}>
      <Image
        accessibilityLabel="Obrázek dokumentu v plném rozlišení"
        source={{ uri }}
        style={{ width, height }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
