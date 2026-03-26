import { useWindowDimensions, Image, StyleSheet, View } from 'react-native';
import { j } from '../theme/jablotron';

type Props = { route: { params: { uri: string } } };

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
    backgroundColor: j.text.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
