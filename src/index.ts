/**
 * `@dloizides/i18n` — the shared i18n runtime for the dloizides RN / RN-web apps.
 *
 * Design notes worth knowing before you use it:
 *
 * 1. **It localizes the whole shared UI kit for free.** {@link Translate} is signature-compatible
 *    with the kit's `t` contract (`UiTranslate`), so passing `useI18n().t` into `UiProvider` means
 *    DataTable / FilterBar / Pager / StatCard / StatusBadge / ModalDropdown all speak the active
 *    locale with zero per-component work.
 * 2. **Both interpolation styles.** Positional `{0}` (what the kit emits) AND named `{count}` (what
 *    hand-written catalogs use). One `t` serves both.
 * 3. **Per-key English fallback.** A partially translated locale shows what it has and falls back
 *    per missing key, so locales can ship incrementally.
 * 4. **No dependencies.** The switcher takes colours as props rather than reaching into a theme
 *    context, so the package couples to nothing.
 */

// Types — the contract.
export type {
  Catalog,
  Catalogs,
  LocaleCode,
  LocaleOption,
  NamedParams,
  Translate,
} from './types';

// Pure core — usable without React (tests, formatters, SSR).
export {
  createTranslator,
  DEFAULT_FALLBACK_LOCALE,
  interpolateNamed,
  interpolatePositional,
  lookup,
} from './createTranslator';

// Locale resolution + persistence.
export {
  applyDocumentLocale,
  browserLanguages,
  DEFAULT_STORAGE_KEY,
  isSupported,
  primarySubtag,
  readStoredLocale,
  resolveInitialLocale,
  writeStoredLocale,
} from './detectLocale';

// React bindings.
export { I18nProvider, useI18n } from './I18nProvider';
export type { I18nProviderProps, I18nValue } from './I18nProvider';

// The switcher.
export { LanguageSwitcher } from './LanguageSwitcher';
export type { LanguageSwitcherColors, LanguageSwitcherProps } from './LanguageSwitcher';
