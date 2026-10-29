/** A plain nested messages object, e.g. the contents of `en.json`. */
export interface MessageTree {
  [key: string]: string | MessageTree;
}

/** Values that can fill a `{{name}}` placeholder. */
export type TemplateParams = Readonly<Record<string, string | number>>;

/** Positional message formatter: `FM(key, p1, p2, ...)` fills `{{p1}}`, `{{p2}}`, ... in order. */
export type FormatMessage = (key: string, ...params: string[]) => string;

const DOUBLE_BRACE_PLACEHOLDER = /\{\{(\w+)\}\}/g;
const POSITIONAL_PREFIX = 'p';

/** Fills `{{name}}` placeholders from `params`; an unknown name is left intact. */
export function interpolateDoubleBrace(template: string, params: TemplateParams): string {
  return template.replace(DOUBLE_BRACE_PLACEHOLDER, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  );
}

function lookupMessage(messages: MessageTree, key: string): string | undefined {
  const found = key
    .split('.')
    .reduce<string | MessageTree | undefined>(
      (node, part) => (typeof node === 'object' ? node[part] : undefined),
      messages,
    );
  return typeof found === 'string' ? found : undefined;
}

function toPositionalParams(params: readonly string[]): Record<string, string> {
  return Object.fromEntries(params.map((value, index) => [`${POSITIONAL_PREFIX}${String(index + 1)}`, value]));
}

/** Builds a React-free, i18next-free `FM()` over a plain messages object; a missing key returns the key. */
export function createFormatMessage(messages: MessageTree): FormatMessage {
  return (key, ...params) => {
    const message = lookupMessage(messages, key);
    if (message === undefined) return key;
    return interpolateDoubleBrace(message, toPositionalParams(params));
  };
}
