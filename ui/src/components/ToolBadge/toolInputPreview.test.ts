import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { toolInputPreview } from './toolInputPreview';

describe('toolInputPreview', () => {
  it.each([
    [undefined],
    [null],
    [''],
    [{}],
    ['{}'],
  ])('shows "no arguments" for %j', (input) => {
    expect(toolInputPreview(input)).toBe('no arguments');
  });

  it.each([
    ['plain text that is not JSON', 'plain text that is not JSON'],
    ['{"broken": ', '{"broken": '],
  ])('returns a non-JSON string as is: %j', (input, expected) => {
    expect(toolInputPreview(input)).toBe(expected);
  });

  it('previews the first key of an object input, showing string values unquoted', () => {
    expect(toolInputPreview({ query: 'weather in Oslo', limit: 5 })).toBe('query: weather in Oslo');
  });

  it('parses a JSON string input the same way as the equivalent object', () => {
    expect(toolInputPreview('{"query":"weather in Oslo","limit":5}')).toBe(
      toolInputPreview({ query: 'weather in Oslo', limit: 5 }),
    );
  });

  it.each([
    [{ limit: 5 }, 'limit: 5'],
    [{ flag: false }, 'flag: false'],
    [{ nothing: null }, 'nothing: null'],
    [{ ids: [1, 2, 3] }, 'ids: [1,2,3]'],
    [{ filter: { tag: 'a', deep: { n: 1 } } }, 'filter: {"tag":"a","deep":{"n":1}}'],
  ])('serialises a non-string first value of %j as JSON', (input, expected) => {
    expect(toolInputPreview(input)).toBe(expected);
  });

  it.each([
    ['42', '42'],
    ['true', 'true'],
    ['null', 'null'],
    ['"quoted"', 'quoted'],
  ])('stringifies the JSON scalar %s', (input, expected) => {
    // The preview shows what the JSON value is; null parses to a scalar and is not "no arguments".
    expect(toolInputPreview(input)).toBe(expected);
  });

  it('returns a very large string value in full', () => {
    const huge = 'x'.repeat(100_000);
    expect(toolInputPreview({ body: huge })).toBe(`body: ${huge}`);
  });

  it('never throws and always returns a string, for any JSON value as object or string input', () => {
    fc.assert(
      fc.property(fc.jsonValue(), (value) => {
        expect(typeof toolInputPreview(value)).toBe('string');
        expect(typeof toolInputPreview(JSON.stringify(value))).toBe('string');
      }),
    );
  });
});
