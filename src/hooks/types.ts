export type FetchBufferOptions = {
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
   * HTTP method to use. Defaults to `POST`.
   */
  method?: "POST" | "GET";
};

export type BufferHook<T = Uint8Array> = (options: FetchBufferOptions) => {
  buffer: T[];
  done: boolean;
  refresh: () => void;
  cancel: () => void;
};