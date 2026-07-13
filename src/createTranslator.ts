/**
 * The pure core: catalog lookup + interpolation. No React, no storage, no side effects — so it is
 * trivially unit-testable and reusable outside a component tree (formatters, tests, server render).
 */
import type { Catalog, Catalogs, LocaleCode, NamedParams, Translate } from './types';

/** The locale every catalog falls back to, per key. English is authoritative. */
export const DEFAULT_FALLBACK_LOCALE = 'en';

/** True for a plain object of named params (as opposed to a positional string/number). */
function isNamedParams(value: unknown): value is NamedParams {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Fill `{name}` placeholders from a params object. An unmatched placeholder is left intact rather
 * than blanked, so a template/param mismatch is visible instead of silently losing text.
 */
export function interpolateNamed(template: string, params: NamedParams): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  );
}

/** Fill `{0}`, `{1}`, `{2}` from positional args (the shared UI kit's calling convention). */
export function interpolatePositional(
  template: string,
  params: ReadonlyArray<string | number | undefined>,
): string {
  return params.reduce<string>(
    (acc, param, index) => (param === undefined ? acc : acc.split(`{${index}}`).join(String(param))),
    template,
  );
}

/**
 * Look a key up in `locale`, then in `fallbackLocale`, then give back the key itself.
 *
 * The fallback is **per key**, not per catalog: a partially translated locale still shows its
 * translated keys and only falls back for the ones it is missing. That is what lets a new locale
 * ship incrementally instead of all-or-nothing.
 */
export function lookup(
  catalogs: Catalogs,
  locale: LocaleCode,
  key: string,
  fallbackLocale: LocaleCode = DEFAULT_FALLBACK_LOCALE,
): string {
  const active: Catalog | undefined = catalogs[locale];
  const fallback: Catalog | undefined = catalogs[fallbackLocale];
  return active?.[key] ?? fallback?.[key] ?? key;
}

/**
 * Build a {@link Translate} bound to one locale. Supports BOTH interpolation styles — see the
 * `Translate` docs for why (positional = the UI kit; named = hand-written app catalogs).
 */
export function createTranslator(
  catalogs: Catalogs,
  locale: LocaleCode,
  fallbackLocale: LocaleCode = DEFAULT_FALLBACK_LOCALE,
): Translate {
  return (key, p1, p2, p3) => {
    const template = lookup(catalogs, locale, key, fallbackLocale);
    if (isNamedParams(p1)) return interpolateNamed(template, p1);
    return interpolatePositional(template, [p1, p2, p3]);
  };
}
