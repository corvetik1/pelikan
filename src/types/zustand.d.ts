declare module "zustand" {
  /** Minimal typings for create to support generic state */

  export type SetState<T> = (
    partial: Partial<T> | ((state: T) => Partial<T> | T),
  ) => void;

  export interface StoreApi<T> {
    getState: () => T;
    setState: SetState<T>;
    // simplified subscribe
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
  }

  export interface UseBoundStore<T> {
    (): T;
    <U>(selector: (state: T) => U): U;
  }

  export type StateCreator<T> = (set: SetState<T>, get?: () => T) => T;

  export default function create<T>(
    initializer: StateCreator<T>,
  ): UseBoundStore<T>;

  // Also keep named export for completeness
  export { create };

}

