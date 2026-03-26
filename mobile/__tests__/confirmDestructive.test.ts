import { Platform } from 'react-native';
import { confirmDestructive } from '../src/ui/confirmDestructive';

describe('confirmDestructive', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    (Platform as { OS: typeof Platform.OS }).OS = originalOS;
  });

  it('na webu zavolá onConfirm po souhlasu window.confirm', () => {
    (Platform as { OS: typeof Platform.OS }).OS = 'web';
    const prev = globalThis.window;
    const confirmFn = jest.fn().mockReturnValue(true);
    try {
      (globalThis as { window: Window & { confirm: typeof confirmFn } }).window =
        Object.assign(prev ?? ({} as Window), { confirm: confirmFn });
      const onConfirm = jest.fn();

      confirmDestructive('Titulek', 'Zpráva', onConfirm);

      expect(confirmFn).toHaveBeenCalled();
      expect(onConfirm).toHaveBeenCalledTimes(1);
    } finally {
      (globalThis as { window: typeof prev }).window = prev;
    }
  });

  it('na webu po zrušení confirm nevolá onConfirm', () => {
    (Platform as { OS: typeof Platform.OS }).OS = 'web';
    const prev = globalThis.window;
    const confirmFn = jest.fn().mockReturnValue(false);
    try {
      (globalThis as { window: Window & { confirm: typeof confirmFn } }).window =
        Object.assign(prev ?? ({} as Window), { confirm: confirmFn });
      const onConfirm = jest.fn();

      confirmDestructive('Titulek', 'Zpráva', onConfirm);

      expect(onConfirm).not.toHaveBeenCalled();
    } finally {
      (globalThis as { window: typeof prev }).window = prev;
    }
  });
});
