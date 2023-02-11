import { useEffect, useState } from "react";
import { DECODER } from "../../globs/shared";
import { useBuffer } from "../useBuffer";

/**
 * Custom hook that updates with the current token buffer.
 *
 * @note Thanks to GPT for guidance on AbortControllers and fucked up state
 * logic.
 */
export const useTextStream = (
  url: string,
  delay = 300,
) => {
  const { buffer, ...hooks } = useBuffer(url, delay);
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
