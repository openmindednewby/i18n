/** The slice of an i18next instance that {@link createFormatCount} needs. */
export interface CountTranslator {
  t: (id: string, options: { count: number; p1: string }) => string;
}

/** Counted-message formatter: picks the key's `_one` / `_other` form and fills `{{p1}}` with the count. */
export type FormatCount = (id: string, count: number) => string;

/** Builds the portal `FMCount()` helper over an initialised i18next instance. */
export function createFormatCount(translator: CountTranslator): FormatCount {
  return (id, count) => translator.t(id, { count, p1: String(count) });
}
