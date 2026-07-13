/**
 * `I18nProvider` — holds the active locale, exposes a memoized {@link Translate}, persists the
 * user's choice, and reflects `lang`/`dir` on the document.
 *
 * Wiring it to the rest of the shared kit is one line, because {@link Translate} is
 * signature-compatible with the kit's `t` contract:
 *
 * ```tsx
 * <I18nProvider catalogs={CATALOGS} locales={LOCALES}>
 *   <KitBridge />   // const { t } = useI18n(); return <UiProvider theme={theme} t={t}>…
 * </I18nProvider>
 * ```
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { createTranslator, DEFAULT_FALLBACK_LOCALE } from './createTranslator';
import {
  applyDocumentLocale,
  browserLanguages,
  DEFAULT_STORAGE_KEY,
  readStoredLocale,
  resolveInitialLocale,
  writeStoredLocale,
} from './detectLocale';
import type { Catalogs, LocaleCode, LocaleOption, Translate } from './types';

export interface I18nValue {
  /** Resolve a key in the active locale (positional or named interpolation). */
  t: Translate;
  /** The active locale code. */
  locale: LocaleCode;
  /** Switch locale: re-renders consumers, persists the choice, updates `lang`/`dir`. */
  setLocale: (code: LocaleCode) => void;
  /** Every locale the app offers (for a switcher). */
  locales: readonly LocaleOption[];
}

const I18nContext = createContext<I18nValue | null>(null);

export interface I18nProviderProps {
  /** Every locale's catalog. The fallback locale's catalog is required. */
  catalogs: Catalogs;
  /** The locales offered to the user, in display order. */
  locales: readonly LocaleOption[];
  /** Per-key fallback locale. Default `en`. */
  fallbackLocale?: LocaleCode;
  /** localStorage key for the persisted choice. Default `dloizides_locale`. */
  storageKey?: string;
  /** Force a locale (tests / SSR). When set, detection and persistence are skipped. */
  initialLocale?: LocaleCode;
  children: React.ReactNode;
}

export function I18nProvider({
  catalogs,
  locales,
  fallbackLocale = DEFAULT_FALLBACK_LOCALE,
  storageKey = DEFAULT_STORAGE_KEY,
  initialLocale,
  children,
}: I18nProviderProps): React.ReactElement {
  // Resolved once, lazily: stored choice → browser preference → fallback. Reading storage and
  // `navigator` inside the initializer keeps the first paint on the right locale (no flash of
  // English before a `useEffect` corrects it).
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    if (initialLocale) return initialLocale;
    const resolved = resolveInitialLocale(
      locales,
      readStoredLocale(storageKey),
      browserLanguages(),
      fallbackLocale,
    );
    applyDocumentLocale(locales, resolved);
    return resolved;
  });

  const setLocale = useCallback(
    (code: LocaleCode) => {
      setLocaleState(code);
      writeStoredLocale(storageKey, code);
      applyDocumentLocale(locales, code);
    },
    [locales, storageKey],
  );

  const t = useMemo(
    () => createTranslator(catalogs, locale, fallbackLocale),
    [catalogs, locale, fallbackLocale],
  );

  const value = useMemo<I18nValue>(
    () => ({ t, locale, setLocale, locales }),
    [t, locale, setLocale, locales],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Access the active locale + translate function. Throws outside an {@link I18nProvider}. */
export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (value === null) throw new Error('useI18n must be used inside an <I18nProvider>.');
  return value;
}
