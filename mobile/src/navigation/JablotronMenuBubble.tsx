import Constants from 'expo-constants';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { j } from '../theme/jablotron';
import { useMenuBubble } from './MenuBubbleContext';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

/**
 * Sekundární nabídka jako bublina pod hamburgerem (skill ui-designer-jablotron).
 */
export function JablotronMenuBubble() {
  const insets = useSafeAreaInsets();
  const { menuVisible, closeMenu } = useMenuBubble();
  const top = insets.top + j.layout.headerBelowSafeTop + j.space[1];

  return (
    <Modal
      visible={menuVisible}
      transparent
      animationType="fade"
      onRequestClose={closeMenu}
      accessibilityViewIsModal
    >
      <View style={styles.modalRoot}>
        <Pressable
          style={styles.backdrop}
          onPress={closeMenu}
          accessibilityLabel="Zavřít menu"
        />
        <View
          style={[styles.bubble, { top, right: j.space[4] }]}
          accessibilityRole="menu"
        >
          <Text style={styles.menuTitle} accessibilityRole="header">
            Menu
          </Text>
          <View style={styles.footer}>
            <Text
              style={styles.version}
              accessibilityLabel={`Verze ${APP_VERSION}`}
            >
              Verze {APP_VERSION}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bubble: {
    position: 'absolute',
    minWidth: 200,
    maxWidth: 288,
    backgroundColor: j.surface.base,
    borderRadius: j.radius.lg,
    borderWidth: 1,
    borderColor: j.border.primary,
    overflow: 'hidden',
  },
  menuTitle: {
    fontSize: j.font.sm,
    fontWeight: j.weight.semibold,
    color: j.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: j.space[4],
    paddingTop: j.space[4],
    paddingBottom: j.space[2],
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: j.border.primary,
    paddingVertical: j.space[4],
    paddingHorizontal: j.space[4],
  },
  version: {
    fontSize: j.font.xs,
    color: j.text.tertiary,
  },
});
