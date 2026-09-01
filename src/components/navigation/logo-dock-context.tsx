'use client';

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';

type LogoDockContextValue = {
  headerRef: RefObject<HTMLElement | null>;
  navSlotRef: RefObject<HTMLDivElement | null>;
  wordmarkRef: RefObject<HTMLImageElement | null>;
};

const LogoDockContext = createContext<LogoDockContextValue | null>(null);

export function LogoDockProvider({ children }: { children: ReactNode }) {
  const headerRef = useRef<HTMLElement | null>(null);
  const navSlotRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLImageElement | null>(null);

  const value = useMemo(
    () => ({
      headerRef,
      navSlotRef,
      wordmarkRef,
    }),
    [],
  );

  return (
    <LogoDockContext.Provider value={value}>{children}</LogoDockContext.Provider>
  );
}

export function useLogoDock(): LogoDockContextValue {
  const context = useContext(LogoDockContext);
  if (!context) {
    throw new Error('useLogoDock must be used within LogoDockProvider');
  }
  return context;
}
