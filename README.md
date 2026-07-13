# @dloizides/i18n

Tiny, dependency-free i18n runtime for React / React Native (RN-web) apps.

Locale detection, a persisted choice, **per-key** English fallback, **both** positional and named
interpolation, and a themable `LanguageSwitcher`.

## Why this one

Its `t` is signature-compatible with the `@dloizides` UI kit's translate contract
(`UiTranslate` = `(key, p1?, p2?, p3?) => string`). So handing `useI18n().t` to `UiProvider`
localizes **every shared component** — `DataTable`, `FilterBar`, `Pager`, `StatCard`,
`StatusBadge`, `ModalDropdown` — with zero per-component work.

## Install

```bash
npm install @dloizides/i18n
```

Peer deps: `react >=18`, `react-native >=0.74` (RN-web counts).

## Quick start

```tsx
import { I18nProvider, useI18n, LanguageSwitcher, type Catalogs, type LocaleOption } from '@dloizides/i18n';
import { UiProvider } from '@dloizides/ui-feedback';

const LOCALES: LocaleOption[] = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
];

const CATALOGS: Catalogs = {
  en: { 'cases.title': 'Cases', 'cases.count': '{count} results' },
  de: { 'cases.title': 'Fälle',  'cases.count': '{count} Ergebnisse' },
};

// Bridge the locale into the shared UI kit — this is the whole integration.
function KitBridge({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  return <UiProvider theme={theme} t={t}>{children}</UiProvider>;
}

export default function App() {
  return (
    <I18nProvider catalogs={CATALOGS} locales={LOCALES}>
      <KitBridge>
        <Screen />
      </KitBridge>
    </I18nProvider>
  );
}

function Screen() {
  const { t } = useI18n();
  return (
    <>
      <Text>{t('cases.title')}</Text>
      <Text>{t('cases.count', { count: 12 })}</Text>
      <LanguageSwitcher colors={{ text: '#667', activeText: '#fff', activeBackground: '#4f46e5' }} />
    </>
  );
}
```

## Interpolation — two styles, one `t`

| Style | Call | Template | Used by |
|---|---|---|---|
| **Positional** | `t('stat', 'CPU', '9')` | `Metric {0} is {1}` | the shared UI kit (its `t` contract is positional) |
| **Named** | `t('count', { count: 12 })` | `{count} results` | hand-written app catalogs (more readable, reorder-safe) |

Prefer **named** in app catalogs. Positional exists so the kit's calls keep working.

## Behaviour worth knowing

- **Per-key fallback.** A locale missing one key falls back to English *for that key only* — the
  rest of the locale still shows translated. Locales can therefore ship incrementally instead of
  all-or-nothing.
- **A missing key renders as the key.** Visibly wrong beats silently blank.
- **Resolution order:** stored choice → browser language (primary subtag, so `de-AT` → `de`) →
  fallback. Resolved lazily during the first render, so there is no flash of English.
- **Storage never throws.** Private mode / native / SSR just means the choice isn't remembered.
- **RTL hook.** `applyDocumentLocale` sets `<html lang dir>`; mark a locale `rtl: true` and CSS using
  logical properties or `[dir="rtl"]` mirrors itself. No RTL locale ships today — the hook is there.

## API

| Export | Purpose |
|---|---|
| `I18nProvider` | Holds the locale, memoizes `t`, persists the choice, sets `lang`/`dir`. |
| `useI18n()` | `{ t, locale, setLocale, locales }`. |
| `LanguageSwitcher` | Segmented locale control. Colours come in as **props**, so this package depends on no theme. |
| `createTranslator(catalogs, locale, fallback?)` | Pure `t` — usable outside React (tests, formatters, SSR). |
| `lookup`, `interpolateNamed`, `interpolatePositional` | The pure primitives, exported for tests/tooling. |
| `resolveInitialLocale`, `primarySubtag`, `isSupported` | Pure locale resolution. |
| `readStoredLocale`, `writeStoredLocale`, `applyDocumentLocale`, `browserLanguages` | Environment adapters. |

## Catalog conventions

Flat, dotted keys, namespaced by screen — `cases.title`, `onboarding.step1.lead`. English is
authoritative: every key MUST exist in `en`. Keep catalogs as plain JSON/TS objects so they can be
handed to translators and diffed.

## License

MIT
