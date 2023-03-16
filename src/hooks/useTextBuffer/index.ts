import { useEffect, useState } from "react";
import { DECODER } from "../../globs/shared";
import { BufferHook } from "../types";
import { useBuffer } from "../useBuffer";

/**
 *  Helper method that parses the responses from "chat" endpoint and
 *  extracts the value of the 'content' key.
 */
function extractContentStrings(input: Uint8Array[]): string[] {
  const contentStrings: string[] = [];

  for (const element of input) {
    const decoded = DECODER.decode(element);
    const jsonFragments = decoded.split(/}(?=\{)/);
    for (const jsonFragment of jsonFragments) {
      try {
        const parsedJson = JSON.parse(
          jsonFragment + (jsonFragment.endsWith("}") ? "" : "}")
        );
        if (parsedJson.content) {
          contentStrings.push(parsedJson.content);
        }
      } catch (error) {}
    }
  }

  return contentStrings;
}

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

  useEffect(() => {
    if (buffer) {
      const responseType = args.responseType || "plaintext";

      if(responseType === "plaintext") {
        const decoded = buffer.map((chunk) => DECODER.decode(chunk));
        setTextBuffer(decoded);
      }

      if (args.responseType === "chat") {
        const decoded = extractContentStrings(buffer);
        setTextBuffer(decoded);
      }
    }
  }, [args.responseType, buffer]);

  return {
    ...hooks,
    buffer: textBuffer,
  };
};
