import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import Image from 'next/image';

export interface NewsContentProps {
  markdown: string;
}

/**
 * Безопасный SSR-рендер Markdown-контента новости.
 * Использует remark-gfm + rehype-sanitize.
 * Картинки рендерятся через next/image с ленивой загрузкой.
 */
export default function NewsContent({ markdown }: NewsContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
          const { src, alt, ...rest } = props;
          return (
            <Image
              src={typeof src === 'string' ? src : ''}
              alt={alt ?? ''}
              width={800}
              height={600}
              style={{ maxWidth: '100%', height: 'auto' }}
              loading="lazy"
              {...(rest as Record<string, unknown>)}
            />
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
