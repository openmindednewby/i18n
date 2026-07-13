/**
 * Unit tests for the pure lookup + interpolation core — logic, not rendering.
 */
import {
  createTranslator,
  interpolateNamed,
  interpolatePositional,
  lookup,
} from './createTranslator';
import type { Catalogs } from './types';

const CATALOGS: Catalogs = {
  en: {
    'cases.title': 'Cases',
    'cases.count': '{count} results',
    'kit.stat': 'Metric {0} is {1}',
    'only.en': 'English only',
  },
  de: {
    'cases.title': 'Fälle',
    'cases.count': '{count} Ergebnisse',
    'kit.stat': 'Kennzahl {0} ist {1}',
    // `only.en` deliberately absent — proves the per-key fallback.
  },
};

describe('lookup', () => {
  it('resolves from the active locale', () => {
    expect(lookup(CATALOGS, 'de', 'cases.title')).toBe('Fälle');
  });

  it('falls back PER KEY to English, not per catalog', () => {
    // de has its own cases.title but is missing only.en — it must still get the English string
    // rather than the whole locale collapsing to English.
    expect(lookup(CATALOGS, 'de', 'cases.title')).toBe('Fälle');
    expect(lookup(CATALOGS, 'de', 'only.en')).toBe('English only');
  });

  it('falls back to English for an entirely unknown locale', () => {
    expect(lookup(CATALOGS, 'xx', 'cases.title')).toBe('Cases');
  });

  it('returns the key itself when nothing has it (visible, not blank)', () => {
    expect(lookup(CATALOGS, 'de', 'totally.missing')).toBe('totally.missing');
  });
});

describe('interpolateNamed', () => {
  it('fills named placeholders', () => {
    expect(interpolateNamed('{count} results', { count: 12 })).toBe('12 results');
  });

  it('fills a placeholder used more than once', () => {
    expect(interpolateNamed('{a} and {a}', { a: 'x' })).toBe('x and x');
  });

  it('leaves an unmatched placeholder intact rather than blanking it', () => {
    expect(interpolateNamed('{count} of {total}', { count: 1 })).toBe('1 of {total}');
  });
});

describe('interpolatePositional', () => {
  it('fills {0}/{1}/{2}', () => {
    expect(interpolatePositional('Metric {0} is {1}', ['CPU', '9'])).toBe('Metric CPU is 9');
  });

  it('ignores undefined params', () => {
    expect(interpolatePositional('a {0} b {1}', ['X', undefined])).toBe('a X b {1}');
  });

  it('replaces every occurrence of the same index', () => {
    expect(interpolatePositional('{0}-{0}', ['z'])).toBe('z-z');
  });
});

describe('createTranslator', () => {
  it('translates in the active locale', () => {
    const t = createTranslator(CATALOGS, 'de');
    expect(t('cases.title')).toBe('Fälle');
  });

  it('supports the UI kit’s POSITIONAL contract, (key, p1, p2, p3)', () => {
    const t = createTranslator(CATALOGS, 'de');
    expect(t('kit.stat', 'CPU', '9')).toBe('Kennzahl CPU ist 9');
  });

  it('supports the app catalogs’ NAMED contract, (key, { name })', () => {
    const t = createTranslator(CATALOGS, 'de');
    expect(t('cases.count', { count: 3 })).toBe('3 Ergebnisse');
  });

  it('falls back per key while still translating the rest', () => {
    const t = createTranslator(CATALOGS, 'de');
    expect(t('only.en')).toBe('English only');
    expect(t('cases.title')).toBe('Fälle');
  });

  it('honours a custom fallback locale', () => {
    const t = createTranslator(CATALOGS, 'xx', 'de');
    expect(t('cases.title')).toBe('Fälle');
  });
});
