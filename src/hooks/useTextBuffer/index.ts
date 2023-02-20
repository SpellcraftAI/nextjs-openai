import { useEffect, useState } from "react";
import { DECODER } from "../../globs/shared";
import { BufferHook } from "../types";
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
export const useTextBuffer: BufferHook<string> = (args) => {
  const { buffer, ...hooks } = useBuffer(args);
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
