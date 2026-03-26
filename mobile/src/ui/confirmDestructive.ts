import { Alert, Platform } from 'react-native';

/**
 * Potvrzení destruktivní akce. Na webu `Alert.alert` často nefunguje spolehlivě – použije se `window.confirm`.
 */
export function confirmDestructive(
  title: string,
  message: string,
  onConfirm: () => void,
  options?: { cancelText?: string; confirmText?: string }
): void {
  const cancelText = options?.cancelText ?? 'Zrušit';
  const confirmText = options?.confirmText ?? 'Smazat';

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(`${title}\n\n${message}`);
      if (ok) {
        onConfirm();
      }
    }
    return;
  }

  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}
