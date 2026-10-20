import i18n, { type i18n as I18nInstance, type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

/** Options for {@link initI18n}: the app's resources and languages; the package owns the init chain. */
export interface InitI18nOptions {
  resources: Resource;
  lng?: string;
  fallbackLng?: string;
  escapeValue?: boolean;
  defaultNS?: string | readonly string[];
  ns?: string | readonly string[];
}

const DEFAULT_FALLBACK_LNG = 'en';

const ignoreInitRejection = (): void => undefined;

/** Wires react-i18next into the i18next singleton, runs `.init()` and returns the singleton. */
export function initI18n(options: InitI18nOptions): I18nInstance {
  const {
    resources,
    lng,
    fallbackLng = DEFAULT_FALLBACK_LNG,
    escapeValue = false,
    defaultNS,
    ns,
  } = options;

  i18n
    .use(initReactI18next)
    .init({
      lng: lng ?? fallbackLng,
      fallbackLng,
      resources,
      ...(defaultNS !== undefined ? { defaultNS } : {}),
      ...(ns !== undefined ? { ns } : {}),
      interpolation: {
        escapeValue,
      },
    })
    .catch(ignoreInitRejection);

  return i18n;
}
