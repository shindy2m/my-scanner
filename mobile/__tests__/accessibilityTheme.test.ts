import { MIN_TOUCH_TARGET } from '../src/theme/accessibility';

describe('theme/accessibility (E6)', () => {
  it('minimální dotykový cíl odpovídá ~48 dp', () => {
    expect(MIN_TOUCH_TARGET).toBeGreaterThanOrEqual(44);
    expect(MIN_TOUCH_TARGET).toBe(48);
  });
});
