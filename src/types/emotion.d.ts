declare module '@emotion/server/create-instance' {
  import type { EmotionCache } from '@emotion/cache';
  interface ExtractCriticalResult {
    html: string;
    css: string;
    ids: string[];
  }

  export interface EmotionServer {
    extractCriticalToChunks(html: string): ExtractCriticalResult;
    // older API alias
    extractCritical?(html: string): ExtractCriticalResult;
    constructStyleTagsFromChunks(result: ExtractCriticalResult): string;
    constructStyleTagsFromHtml(html: string): string;
  }

  export default function createEmotionServer(cache: EmotionCache): EmotionServer;
}
