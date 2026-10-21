/** The slice of an i18next instance that {@link createFormatMessage} needs. */
export interface MessageTranslator {
  t: (id: string, options: Record<string, string>) => string;
}

/** Positional-parameter message formatter: `FM(id, p1, p2, p3)` maps to `{{p1}}`..`{{p3}}`. */
export type FormatMessage = (id: string, p1?: string, p2?: string, p3?: string) => string;

/** Builds the portal `FM()` helper over an initialised i18next instance. */
export function createFormatMessage(translator: MessageTranslator): FormatMessage {
  return (id, p1, p2, p3) => {
    const options: Record<string, string> = {};
    if (p1 !== undefined && p1 !== null) options.p1 = p1;
    if (p2 !== undefined && p2 !== null) options.p2 = p2;
    if (p3 !== undefined && p3 !== null) options.p3 = p3;
    return translator.t(id, options);
  };
}
