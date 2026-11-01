import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import type { MeUsagePoint } from '@/types';
import { pointTotalTokens } from './usage-points';

const point = (overrides: Partial<MeUsagePoint> = {}): MeUsagePoint => ({
  label: '2026-06-01',
  cost: 0,
  input_tokens: 0,
  output_tokens: 0,
  cache_read_input_tokens: 0,
  cache_write_input_tokens: 0,
  ...overrides,
});

describe('pointTotalTokens', () => {
  it('is zero for a point with no tokens', () => {
    expect(pointTotalTokens(point())).toBe(0);
  });

  it('sums input, output, cache reads and cache writes', () => {
    expect(
      pointTotalTokens(
        point({ input_tokens: 1, output_tokens: 20, cache_read_input_tokens: 300, cache_write_input_tokens: 4000 }),
      ),
    ).toBe(4321);
  });

  it.each([
    ['input', { input_tokens: 7 }],
    ['output', { output_tokens: 7 }],
    ['cache read', { cache_read_input_tokens: 7 }],
    ['cache write', { cache_write_input_tokens: 7 }],
  ])('counts %s tokens', (_category, overrides) => {
    expect(pointTotalTokens(point(overrides))).toBe(7);
  });

  it('ignores cost and label, for any point', () => {
    fc.assert(
      fc.property(
        fc.record({
          input_tokens: fc.nat(1e9),
          output_tokens: fc.nat(1e9),
          cache_read_input_tokens: fc.nat(1e9),
          cache_write_input_tokens: fc.nat(1e9),
        }),
        fc.double({ min: 0, max: 1e6, noNaN: true }),
        fc.string(),
        (tokens, cost, label) => {
          expect(pointTotalTokens(point({ ...tokens, cost, label }))).toBe(
            pointTotalTokens(point({ ...tokens })),
          );
        },
      ),
    );
  });
});
