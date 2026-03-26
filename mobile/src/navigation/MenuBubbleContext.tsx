import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type MenuBubbleContextValue = {
  openMenu: () => void;
  closeMenu: () => void;
  menuVisible: boolean;
};

const MenuBubbleContext = createContext<MenuBubbleContextValue | null>(null);

export function MenuBubbleProvider({ children }: { children: ReactNode }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const value = useMemo(
    () => ({ openMenu, closeMenu, menuVisible }),
    [openMenu, closeMenu, menuVisible]
  );

  return (
    <MenuBubbleContext.Provider value={value}>
      {children}
    </MenuBubbleContext.Provider>
  );
}

export function useMenuBubble() {
  const ctx = useContext(MenuBubbleContext);
  if (!ctx) {
    throw new Error('useMenuBubble must be used within MenuBubbleProvider');
  }
  return ctx;
}
