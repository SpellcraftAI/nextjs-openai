export type FetchOptions = Omit<RequestInit, "body" | "url">;

export interface BufferConfig {
  /**
   * The URL to load the buffer from.
   */
  url: string;
  /**
   * Time (in ms) to throttle updates by.
   */
  throttle?: number;
  /**
   * Data to send with the request.
   */
  data?: Parameters<typeof JSON.stringify>[0];
  /**
   * Custom fetch options.
   */
  options?: FetchOptions;
}

export type SerializedError = { name: string; message: string };

export type BufferHook<T = Uint8Array> = (config: BufferConfig) => {
  buffer: T[];
  done: boolean;
  error: SerializedError | null;
  refresh: () => void;
  cancel: () => void;
};