import { themeTokensSchema, MAX_TOKENS_BYTES, MAX_TOKENS_DEPTH } from '@/lib/validation/themeSchema';
import { z } from 'zod';

function generateNested(depth: number): Record<string, unknown> {
  let obj: Record<string, unknown> = { value: 'x' };
  for (let i = 0; i < depth; i += 1) {
    obj = { nested: obj };
  }
  return obj;
}

describe('themeTokensSchema', () => {
  it('passes with minimal valid palette/typography', () => {
    const tokens = {
      palette: { primary: { main: '#fff' } },
      typography: { fontFamily: 'Inter' },
    };
    expect(() => themeTokensSchema.parse(tokens)).not.toThrow();
  });

  it('fails when required keys are missing', () => {
    const tokens = { palette: {} };
    expect(() => themeTokensSchema.parse(tokens)).toThrow(z.ZodError);
  });

  it(`fails when depth exceeds ${MAX_TOKENS_DEPTH}`, () => {
    const deepObj = generateNested(MAX_TOKENS_DEPTH + 1);
    const tokens = { palette: {}, typography: {}, deepObj };
    expect(() => themeTokensSchema.parse(tokens)).toThrow(z.ZodError);
  });

  it('fails when size exceeds limit', () => {
    // Create a large palette string just over limit
    const bigString = 'a'.repeat(MAX_TOKENS_BYTES);
    const tokens = {
      palette: { big: bigString },
      typography: {},
    };
    expect(() => themeTokensSchema.parse(tokens)).toThrow(z.ZodError);
  });
});
