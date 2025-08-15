import type { emptySplitApi } from '@/redux/api';

// Совместимые типы для Socket.IO инвалидации между сервером и клиентом
type InvalidateTagsParam = Parameters<typeof emptySplitApi.util.invalidateTags>[0];
type ResolveArrayElement<T> = T extends ReadonlyArray<infer U> ? U : T;
export type AppTagDescription = ResolveArrayElement<InvalidateTagsParam>;
export type InvalidateTags = AppTagDescription[];

export type InvalidatePayload = {
  tags: InvalidateTags;
  message?: string;
};

// События сервера → клиент
export interface ServerToClientEvents {
  invalidate: (payload: InvalidatePayload) => void;
}

// События клиента → сервер (пока не используются)
export interface ClientToServerEvents {}
