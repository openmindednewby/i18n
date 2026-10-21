import { createFormatMessage } from './createFormatMessage';

function makeTranslator(): { t: jest.Mock } {
  return { t: jest.fn((id: string) => `t:${id}`) };
}

describe('createFormatMessage', () => {
  it('with no parameters, passes an empty options object', () => {
    const translator = makeTranslator();
    const fm = createFormatMessage(translator);

    fm('menu.title');

    expect(translator.t).toHaveBeenCalledWith('menu.title', {});
  });

  it('with three parameters, maps them to p1, p2 and p3', () => {
    const translator = makeTranslator();
    const fm = createFormatMessage(translator);

    fm('menu.count', 'a', 'b', 'c');

    expect(translator.t).toHaveBeenCalledWith('menu.count', { p1: 'a', p2: 'b', p3: 'c' });
  });

  it('with only the second parameter set, omits p1 and p3', () => {
    const translator = makeTranslator();
    const fm = createFormatMessage(translator);

    fm('menu.count', undefined, 'b');

    expect(translator.t).toHaveBeenCalledWith('menu.count', { p2: 'b' });
  });

  it('with a translator result, returns it unchanged', () => {
    const fm = createFormatMessage(makeTranslator());

    const result = fm('menu.title');

    expect(result).toBe('t:menu.title');
  });

  it('with an empty-string parameter, keeps it', () => {
    const translator = makeTranslator();
    const fm = createFormatMessage(translator);

    fm('menu.count', '');

    expect(translator.t).toHaveBeenCalledWith('menu.count', { p1: '' });
  });
});
