# Changelog

All notable changes to `@dloizides/i18n` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

EXTRACT-TS-I18N-1 "Fold duplicated i18n and utils into @dloizides/i18n and @dloizides/utils".

### Added

- `createFormatMessage(i18n)` builds the portal `FM(id, p1, p2, p3)` helper that 8 portals carried as a local copy.

## [1.1.0] — 2026-10-20

D-PAT-15 "Move initI18n out of frontend-devtools so it is dev-only".

### Added

- `initI18n(options)` + `InitI18nOptions`, moved unchanged from `@dloizides/frontend-devtools`
  (removed there in 2.0.0): wires `react-i18next` into the i18next singleton, runs `.init()` and
  returns the singleton. `i18next` and `react-i18next` are optional peer dependencies, needed only
  by apps that call it.

## [1.0.0] — 2026-07-12

Initial release. Extracted as the shared i18n runtime for the dloizides RN / RN-web apps, first
consumed by the PROOViD AML v2 console (which needed parity with the v1 console's 5 locales).

### Added

- `I18nProvider` + `useI18n()` — active locale, memoized `t`, persisted choice, `lang`/`dir` on the
  document.
- `createTranslator` / `lookup` / `interpolateNamed` / `interpolatePositional` — the pure,
  React-free core.
- **Dual interpolation**: positional `{0}` (so the `t` matches the `@dloizides` UI kit's
  `UiTranslate` contract and localizes every shared component for free) *and* named `{count}` (for
  readable hand-written catalogs).
- **Per-key** English fallback, so a partially translated locale ships incrementally rather than
  all-or-nothing. A missing key renders as the key itself.
- Locale resolution: stored → browser language (primary subtag) → fallback, resolved during the
  first render so there is no flash of the fallback language.
- `LanguageSwitcher` — segmented locale control. Colours are **props**, not a theme context, so the
  package depends on nothing.
- RTL hook via `applyDocumentLocale` (`<html dir>`); no RTL locale ships yet.
