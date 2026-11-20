import i18next from 'i18next';

import { createFormatCount } from './createFormatCount';

function makeTranslator(): { t: jest.Mock } {
  return { t: jest.fn((id: string) => `t:${id}`) };
}

async function makeI18n(): Promise<typeof i18next> {
  const instance = i18next.createInstance();
  await instance.init({
    lng: 'en',
    resources: { en: { translation: { beads_one: '{{p1}} bead', beads_other: '{{p1}} beads' } } },
    interpolation: { escapeValue: false },
  });
  return instance;
}

describe('createFormatCount', () => {
  it('with a count of 3, passes count 3 and p1 "3"', () => {
    const translator = makeTranslator();
    const fmCount = createFormatCount(translator);

    fmCount('beads', 3);

    expect(translator.t).toHaveBeenCalledWith('beads', { count: 3, p1: '3' });
  });

  it('with a translator result, returns it unchanged', () => {
    const fmCount = createFormatCount(makeTranslator());

    const result = fmCount('beads', 1);

    expect(result).toBe('t:beads');
  });

  it('with a count of 1 on i18next, returns the _one form "1 bead"', async () => {
    const fmCount = createFormatCount(await makeI18n());

    const result = fmCount('beads', 1);

    expect(result).toBe('1 bead');
  });

  it('with a count of 0 on i18next, returns the _other form "0 beads"', async () => {
    const fmCount = createFormatCount(await makeI18n());

    const result = fmCount('beads', 0);

    expect(result).toBe('0 beads');
  });
});
