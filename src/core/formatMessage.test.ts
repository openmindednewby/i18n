import { createFormatMessage, interpolateDoubleBrace } from './formatMessage';

const messages = {
  app: {
    title: 'Flier Studio',
    count: '{{p1}} of {{p2}}',
    repeat: '{{p1}} and {{p1}}',
  },
  greeting: 'Hello {{name}}',
};

describe('createFormatMessage', () => {
  it('with a nested dotted key, returns its message', () => {
    const fm = createFormatMessage(messages);

    const result = fm('app.title');

    expect(result).toBe('Flier Studio');
  });

  it('with positional params, fills {{p1}} and {{p2}} in order', () => {
    const fm = createFormatMessage(messages);

    const result = fm('app.count', '3', '7');

    expect(result).toBe('3 of 7');
  });

  it('with a placeholder used twice, fills every occurrence', () => {
    const fm = createFormatMessage(messages);

    const result = fm('app.repeat', 'x');

    expect(result).toBe('x and x');
  });

  it('with a missing key, returns the key', () => {
    const fm = createFormatMessage(messages);

    const result = fm('app.nope');

    expect(result).toBe('app.nope');
  });

  it('with a key that points at a branch, returns the key', () => {
    const fm = createFormatMessage(messages);

    const result = fm('app');

    expect(result).toBe('app');
  });

  it('with fewer params than placeholders, leaves the unfilled placeholder intact', () => {
    const fm = createFormatMessage(messages);

    const result = fm('app.count', '3');

    expect(result).toBe('3 of {{p2}}');
  });
});

describe('interpolateDoubleBrace', () => {
  it('with a named param, fills {{name}}', () => {
    const template = 'Hello {{name}}';

    const result = interpolateDoubleBrace(template, { name: 'Ada' });

    expect(result).toBe('Hello Ada');
  });

  it('with a numeric param, writes it as text', () => {
    const template = '{{count}} items';

    const result = interpolateDoubleBrace(template, { count: 4 });

    expect(result).toBe('4 items');
  });

  it('with an unknown name, leaves the placeholder intact', () => {
    const template = 'Hello {{name}}';

    const result = interpolateDoubleBrace(template, { other: 'x' });

    expect(result).toBe('Hello {{name}}');
  });

  it('with single-brace text, leaves it untouched', () => {
    const template = 'Hello {name}';

    const result = interpolateDoubleBrace(template, { name: 'Ada' });

    expect(result).toBe('Hello {name}');
  });
});
