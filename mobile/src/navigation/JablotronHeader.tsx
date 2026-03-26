import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MIN_TOUCH_TARGET } from '../theme/accessibility';
import { j } from '../theme/jablotron';
import { useMenuBubble } from './MenuBubbleContext';

function HamburgerIcon() {
  return (
    <View style={ham.box}>
      <View style={ham.line} />
      <View style={ham.line} />
      <View style={ham.line} />
    </View>
  );
}

const ham = StyleSheet.create({
  box: { width: 22, height: 18, justifyContent: 'space-between' },
  line: {
    height: 3,
    borderRadius: 1,
    backgroundColor: j.text.primary,
    width: '100%',
  },
});

export function JablotronHeader({
  navigation,
  options,
  back,
}: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const { openMenu } = useMenuBubble();
  const headerRightNode =
    typeof options.headerRight === 'function'
      ? options.headerRight({ tintColor: j.text.primary })
      : options.headerRight;

  return (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <View style={styles.left}>
          {back ? (
            <Pressable
              onPress={navigation.goBack}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Zpět"
              hitSlop={8}
            >
              <Text style={styles.backGlyph} accessibilityElementsHidden>
                ‹
              </Text>
            </Pressable>
          ) : null}
          <View style={styles.titleBlock}>
            <Text style={styles.brandLight}>My</Text>
            <Text style={styles.brandBold}>SCANNER</Text>
          </View>
        </View>
        <View style={styles.right}>
          {headerRightNode}
          <Pressable
            onPress={openMenu}
            style={styles.menuBtn}
            accessibilityRole="button"
            accessibilityLabel="Menu"
          >
            <HamburgerIcon />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: j.header.bar,
    borderBottomWidth: 0,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: j.space[4],
    paddingBottom: j.space[3],
    minHeight: 48,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: j.space[2],
    minWidth: 0,
  },
  backBtn: {
    marginRight: j.space[2],
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backGlyph: {
    fontSize: j.font.xxl,
    color: j.text.primary,
    fontWeight: j.weight.bold,
    marginTop: -4,
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexShrink: 1,
  },
  brandLight: {
    fontSize: j.font.lg,
    fontWeight: j.weight.semibold,
    color: j.header.brandLight,
  },
  brandBold: {
    fontSize: j.font.lg,
    fontWeight: j.weight.bold,
    color: j.text.light,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: j.space[2],
  },
  menuBtn: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: j.space[1],
  },
});
