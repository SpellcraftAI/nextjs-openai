import { useEffect, useState } from "react";
import { DECODER } from "../../globs";
import { useBuffer } from "../useBuffer";

/**
 * Custom hook that updates with the current token buffer.
 *
 * @note Thanks to GPT for guidance on AbortControllers and fucked up state
 * logic.
 */
export const useTextBuffer = (
  url: string,
  throttle = 0,
) => {
  const { buffer, ...hooks } = useBuffer(url, throttle);
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
