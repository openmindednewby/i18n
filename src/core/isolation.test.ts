const FORBIDDEN_MODULES = ['react', 'react-dom', 'react-native', 'i18next', 'react-i18next'];

describe('core entry isolation', () => {
  it('with react and i18next unloadable, still imports and formats', () => {
    let formatted = '';

    jest.isolateModules(() => {
      FORBIDDEN_MODULES.forEach((name) =>
        jest.doMock(name, () => {
          throw new Error(`core imported ${name}`);
        }),
      );
      const core = jest.requireActual<typeof import('./index')>('./index');
      formatted = core.createFormatMessage({ a: 'x {{p1}}' })('a', 'y');
    });

    expect(formatted).toBe('x y');
  });
});
