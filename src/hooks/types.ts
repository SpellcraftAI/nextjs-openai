export interface FetchBufferOptions extends RequestInit {
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
}

export type SerializedError = { name: string; message: string };

export type BufferHook<T = Uint8Array> = (options: FetchBufferOptions) => {
  buffer: T[];
  done: boolean;
  error: SerializedError | null;
  refresh: () => void;
  cancel: () => void;
};