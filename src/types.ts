/**
 * The shared i18n contract.
 *
 * `Translate` is deliberately signature-compatible with the `@dloizides` UI kit's translate
 * contract (`UiTranslate` / `FeedbackTranslate`: `(key, p1?, p2?, p3?) => string`). That is the
 * whole trick: hand a `Translate` to `UiProvider`'s `t` and every shared component (DataTable,
 * FilterBar, Pager, StatCard, StatusBadge, ModalDropdown…) is localized for free, with no
 * per-component work.
 */

/** A BCP-47 primary subtag, e.g. `en`, `de`, `pt`. */
export type LocaleCode = string;

/** One locale's flat key → string map. Keys are dotted, e.g. `cases.title`. */
export type Catalog = Readonly<Record<string, string>>;

/** Every locale's catalog, keyed by locale code. The fallback locale must be present. */
export type Catalogs = Readonly<Record<LocaleCode, Catalog>>;

/** Named interpolation values, e.g. `{ count: 3 }` for the template `"{count} results"`. */
export type NamedParams = Readonly<Record<string, string | number>>;

/**
 * Resolve a key to a localized string.
 *
 * Two interpolation styles are supported, so one function serves both worlds:
 * - **Positional** — `t('analytics.statHint', label)` fills `{0}`, `{1}`, `{2}`. This is what the
 *   shared UI kit emits, so the signature must stay `(key, p1?, p2?, p3?)`.
 * - **Named** — `t('leaders.count', { count: 12 })` fills `{count}`. This is what the hand-written
 *   app catalogs use (and what the v1 AML console's catalogs already use), which is why existing
 *   translations can be reused verbatim.
 *
 * A missing key returns the key itself — a visibly wrong string beats a silently blank UI.
 */
export type Translate = (
  key: string,
  p1?: string | number | NamedParams,
  p2?: string | number,
  p3?: string | number,
) => string;

/** A selectable locale: its code, the label shown in the switcher, and its writing direction. */
export interface LocaleOption {
  code: LocaleCode;
  /** Short display label for the switcher, e.g. `EN`. */
  label: string;
  /** Right-to-left script. Defaults to false. No RTL locale ships today; the hook exists. */
  rtl?: boolean;
}
