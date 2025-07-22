import { NewsCreateSchema } from '../newsSchema';

describe('NewsCreateSchema content sanitization', () => {
  it('rejects content containing <script> tag', () => {
    const data = {
      title: 'Test',
      excerpt: 'Short',
      content: '<script>alert(1)</script>',
    };
    expect(() => NewsCreateSchema.parse(data)).toThrow(/script/);
  });

  it('allows safe markdown content', () => {
    const data = {
      title: 'Test',
      excerpt: 'Short',
      content: '# Heading\n\nSome text',
    };
    expect(() => NewsCreateSchema.parse(data)).not.toThrow();
  });
});
