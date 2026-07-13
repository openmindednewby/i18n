/**
 * Locale resolution + persistence.
 *
 * The resolution order mirrors the v1 AML console (`shared/i18n.js`): a previously stored choice
 * wins, else the browser's preferred language (primary subtag only — `de-AT` → `de`), else the
 * fallback. Storage is best-effort: private mode / a native runtime with no `localStorage` must not
 * throw, it just means the choice does not persist.
 */
import type { LocaleCode, LocaleOption } from './types';

/** Default persistence key. Override per app so two apps on one origin don't fight. */
export const DEFAULT_STORAGE_KEY = 'dloizides_locale';

/** True when `code` is one of the app's supported locales. Pure. */
export function isSupported(locales: readonly LocaleOption[], code: string): boolean {
  return locales.some((l) => l.code === code);
}

/** `de-AT` → `de`; `EN` → `en`. Pure. */
export function primarySubtag(tag: string): string {
  return String(tag).toLowerCase().split('-')[0] ?? '';
}

/**
 * Pick the locale to start in: stored → browser-preferred → fallback. Pure — the caller supplies
 * the stored value and the browser's language list, which keeps this testable with no globals.
 */
export function resolveInitialLocale(
  locales: readonly LocaleOption[],
  stored: string | null,
  preferred: readonly string[],
  fallback: LocaleCode,
): LocaleCode {
  if (stored && isSupported(locales, stored)) return stored;
  for (const tag of preferred) {
    const primary = primarySubtag(tag);
    if (isSupported(locales, primary)) return primary;
  }
  return fallback;
}

/** The browser's preferred languages, most-preferred first. `[]` off-web. */
export function browserLanguages(): string[] {
  if (typeof navigator === 'undefined') return [];
  const nav = navigator as Navigator & { userLanguage?: string };
  const list = Array.isArray(nav.languages) && nav.languages.length > 0 ? nav.languages : [];
  const single = nav.language ?? nav.userLanguage;
  return list.length > 0 ? [...list] : single ? [single] : [];
}

/** Read the persisted locale. Never throws (private mode, native, SSR). */
export function readStoredLocale(storageKey: string): string | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

/** Persist the locale. Never throws — a failure just means it won't be remembered. */
export function writeStoredLocale(storageKey: string, code: LocaleCode): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(storageKey, code);
  } catch {
    /* private mode / no storage — the choice simply does not persist */
  }
}

/**
 * Reflect the locale on the document so CSS can react (`:lang()`, `[dir="rtl"]`). Web-only no-op
 * elsewhere. This is the RTL hook: ship an `rtl: true` locale and the layout can mirror itself
 * without any component changes.
 */
export function applyDocumentLocale(locales: readonly LocaleOption[], code: LocaleCode): void {
  if (typeof document === 'undefined') return;
  const option = locales.find((l) => l.code === code);
  document.documentElement.lang = code;
  document.documentElement.dir = option?.rtl ? 'rtl' : 'ltr';
}
