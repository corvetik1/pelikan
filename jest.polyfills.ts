import { TextEncoder, TextDecoder } from 'util';

/**
 * Polyfills for Node < 21 so that MSW/@mswjs/data work under Jest.
 * Provides:
 *   • global.TextEncoder / TextDecoder
 *   • global.BroadcastChannel (minimal implementation sufficient for tests)
 */

// TextEncoder / TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  Object.defineProperty(global, 'TextEncoder', {
    value: TextEncoder,
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

if (typeof global.TextDecoder === 'undefined') {
  Object.defineProperty(global, 'TextDecoder', {
    value: TextDecoder,
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

// Message payload type to avoid use of "any" or "unknown"
// Covers typical JSON-serialisable values MSW may transmit.
export type MessagePayload = string | number | boolean | object | null;

// BroadcastChannel polyfill (simplified, in-memory)
class PolyfillBroadcastChannel {
  public readonly name: string;
  private static channels: Map<string, PolyfillBroadcastChannel[]> = new Map();
  private listener: ((event: { data: MessagePayload }) => void) | null = null;

  constructor(name: string) {
    this.name = name;
    const list = PolyfillBroadcastChannel.channels.get(name) ?? [];
    list.push(this);
    PolyfillBroadcastChannel.channels.set(name, list);
  }

  public postMessage(message: MessagePayload): void {
    const list = PolyfillBroadcastChannel.channels.get(this.name) ?? [];
    for (const channel of list) {
      if (channel !== this) {
        channel.listener?.({ data: message });
      }
    }
  }

  public close(): void {
    const list = PolyfillBroadcastChannel.channels.get(this.name) ?? [];
    PolyfillBroadcastChannel.channels.set(
      this.name,
      list.filter((c) => c !== this),
    );
  }

  public addEventListener(_: 'message', listener: (event: { data: MessagePayload }) => void): void {
    this.listener = listener;
  }

  public removeEventListener(_: 'message', listener: (event: { data: MessagePayload }) => void): void {
    if (this.listener === listener) {
      this.listener = null;
    }
  }

  // onmessage property for legacy handlers
  set onmessage(handler: ((event: { data: MessagePayload }) => void) | null) {
    this.listener = handler;
  }

  get onmessage(): ((event: { data: MessagePayload }) => void) | null {
    return this.listener;
  }
}

// Attach polyfill if not already present
if (typeof global.BroadcastChannel === 'undefined') {
  Object.defineProperty(global, 'BroadcastChannel', {
    value: PolyfillBroadcastChannel,
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

export {};
