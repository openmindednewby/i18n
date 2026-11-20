/** The slice of an i18next instance that {@link createFormatMessage} needs. */
export interface MessageTranslator {
  t: (id: string, options: Record<string, string>) => string;
}

/** Positional-parameter message formatter: `FM(id, p1, p2, p3)` maps to `{{p1}}`..`{{p3}}`. */
export type FormatMessage = (id: string, p1?: string, p2?: string, p3?: string) => string;

/** Options for {@link createFormatMessage}; `blankMissing` renders an unfilled `{{pN}}` as empty text. */
export interface FormatMessageOptions {
  blankMissing?: boolean;
}

const BLANK = '';

function isGiven(value: string | undefined | null): value is string {
  return value !== undefined && value !== null;
}

/** Builds the portal `FM()` helper over an initialised i18next instance. */
export function createFormatMessage(
  translator: MessageTranslator,
  formatOptions: FormatMessageOptions = {},
): FormatMessage {
  const blankMissing = formatOptions.blankMissing === true;
  return (id, p1, p2, p3) => {
    const options: Record<string, string> = {};
    const params: Record<string, string | undefined> = { p1, p2, p3 };
    for (const [name, value] of Object.entries(params)) {
      if (isGiven(value)) options[name] = value;
      else if (blankMissing) options[name] = BLANK;
    }
    return translator.t(id, options);
  };
}
