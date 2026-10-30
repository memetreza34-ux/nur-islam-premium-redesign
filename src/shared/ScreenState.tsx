import { createContext, useCallback, useContext, useRef, useState, type ReactNode, type SetStateAction } from 'react';

const ScreenStateContext = createContext<string | null>(null);
const screens = new Map<string, Map<string, unknown>>();

export function ScreenStateProvider({ stateKey, children }: { stateKey: string; children: ReactNode }) {
  return <ScreenStateContext.Provider value={stateKey}>{children}</ScreenStateContext.Provider>;
}

export function useScreenState<T>(key: string, initial: T | (() => T)) {
  const scope = useContext(ScreenStateContext);
  const [value, setValue] = useState<T>(() => {
    if (scope && screens.get(scope)?.has(key)) return screens.get(scope)!.get(key) as T;
    const next = typeof initial === 'function' ? (initial as () => T)() : initial;
    if (scope) {
      if (!screens.has(scope)) screens.set(scope, new Map());
      screens.get(scope)!.set(key, next);
    }
    return next;
  });
  const current = useRef(value);
  const update = useCallback((action: SetStateAction<T>) => {
    const next = typeof action === 'function' ? (action as (previous: T) => T)(current.current) : action;
    current.current = next;
    if (scope) {
      if (!screens.has(scope)) screens.set(scope, new Map());
      screens.get(scope)!.set(key, next);
    }
    setValue(next);
  }, [scope, key]);
  return [value, update] as const;
}

export function useScreenRef<T>(key: string, initial: T) {
  const [reference] = useScreenState(key, () => ({ current: initial }));
  return reference;
}
