/**
 * Unit tests for locale resolution + persistence. `resolveInitialLocale` is pure (stored value and
 * browser languages are passed in), so the precedence rules are testable without globals.
 */
import {
  isSupported,
  primarySubtag,
  readStoredLocale,
  resolveInitialLocale,
  writeStoredLocale,
} from './detectLocale';
import type { LocaleOption } from './types';

const LOCALES: LocaleOption[] = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'pt', label: 'PT' },
];

describe('primarySubtag', () => {
  it('strips the region and lowercases', () => {
    expect(primarySubtag('de-AT')).toBe('de');
    expect(primarySubtag('EN')).toBe('en');
    expect(primarySubtag('pt-BR')).toBe('pt');
  });
});

describe('isSupported', () => {
  it('matches only offered locales', () => {
    expect(isSupported(LOCALES, 'de')).toBe(true);
    expect(isSupported(LOCALES, 'fr')).toBe(false);
  });
});

describe('resolveInitialLocale', () => {
  it('prefers a stored choice above all else', () => {
    expect(resolveInitialLocale(LOCALES, 'pt', ['de-DE'], 'en')).toBe('pt');
  });

  it('ignores a stored choice that is no longer supported', () => {
    expect(resolveInitialLocale(LOCALES, 'xx', ['de-DE'], 'en')).toBe('de');
  });

  it('falls to the browser preference, matching on the primary subtag', () => {
    expect(resolveInitialLocale(LOCALES, null, ['de-AT'], 'en')).toBe('de');
  });

  it('walks the browser list in order and takes the first supported one', () => {
    expect(resolveInitialLocale(LOCALES, null, ['fr-FR', 'pt-BR', 'de'], 'en')).toBe('pt');
  });

  it('falls back when nothing matches', () => {
    expect(resolveInitialLocale(LOCALES, null, ['fr-FR'], 'en')).toBe('en');
    expect(resolveInitialLocale(LOCALES, null, [], 'en')).toBe('en');
  });
});

describe('storage', () => {
  const KEY = 'test_locale';

  beforeEach(() => localStorage.clear());

  it('round-trips the persisted locale', () => {
    writeStoredLocale(KEY, 'de');
    expect(readStoredLocale(KEY)).toBe('de');
  });

  it('returns null when nothing is stored', () => {
    expect(readStoredLocale(KEY)).toBeNull();
  });

  it('never throws when storage is unavailable (private mode / native)', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const readSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    expect(() => writeStoredLocale(KEY, 'de')).not.toThrow();
    expect(readStoredLocale(KEY)).toBeNull();

    spy.mockRestore();
    readSpy.mockRestore();
  });
});
