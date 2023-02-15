import { useEffect, useState } from "react";
import { DECODER } from "../../globs/shared";
import { useBuffer } from "../useBuffer";

/**
 * Custom hook that updates with the current token buffer.
 *
 * @example
 * ```tsx
 * const { buffer, refresh, cancel, done } = useTextBuffer(url, 500);
 *
 * return (
 *  <div>
 *    <StreamingText buffer={buffer} />
 *    <button onClick={refresh} disabled={!done}>Refresh</button>
 *    <button onClick={cancel} disabled={done}>Cancel</button>
 *  </div>
 * )
 * ```
 *
 * @category Hooks
 */
export const useTextBuffer = (
  /**
   * The URL to fetch the token stream from.
   */
  url: string,
  /**
   * The debounce time in milliseconds. Defaults to `0`.
   */
  debounce = 0,
) => {
  const { buffer, ...hooks } = useBuffer(url, debounce);
  const [textBuffer, setTextBuffer] = useState<string[]>([]);

  useEffect(
    () => {
      if (buffer) {
        const decoded = buffer.map((chunk) => DECODER.decode(chunk));
        setTextBuffer(decoded);
      }
    },
    [buffer],
  );

  return {
    ...hooks,
    buffer: textBuffer,
  };
};
