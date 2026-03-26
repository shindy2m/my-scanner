import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { DocumentInputSource, RecognitionResult } from '../services/recognition';
import { createSessionScanItem, type SessionScanItem } from './types';

type AddScanInput = {
  result: RecognitionResult;
  previewUri: string | null;
  inputSource: DocumentInputSource | null;
};

type SessionScanContextValue = {
  items: SessionScanItem[];
  addScan: (input: AddScanInput) => string;
  updateScan: (
    id: string,
    patch: Partial<Pick<SessionScanItem, 'documentType' | 'standardFields'>>
  ) => void;
};

const SessionScanContext = createContext<SessionScanContextValue | null>(null);

export function SessionScanProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SessionScanItem[]>([]);

  const addScan = useCallback((input: AddScanInput): string => {
    const item = createSessionScanItem(input);
    setItems((prev) => [item, ...prev]);
    return item.id;
  }, []);

  const updateScan = useCallback(
    (
      id: string,
      patch: Partial<Pick<SessionScanItem, 'documentType' | 'standardFields'>>
    ) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
      );
    },
    []
  );

  const value = useMemo(
    () => ({ items, addScan, updateScan }),
    [items, addScan, updateScan]
  );

  return (
    <SessionScanContext.Provider value={value}>
      {children}
    </SessionScanContext.Provider>
  );
}

export function useSessionScans(): SessionScanContextValue {
  const ctx = useContext(SessionScanContext);
  if (!ctx) {
    throw new Error('useSessionScans must be used within SessionScanProvider');
  }
  return ctx;
}
