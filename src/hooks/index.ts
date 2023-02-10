import { DispatchWithoutAction, useEffect, useReducer, useState } from "react";
import { DECODER } from "../globs/shared";
import { readStream } from "../lib/utils";

/**
 * Custom hook that returns a string with the current text of the token stream.
 */
export const useTokenStream = (
  url: string
): [string, DispatchWithoutAction] => {
  const [text, setText] = useState("");
  const [refreshCount, refresh] = useReducer(x => x + 1, 0);

  useEffect(() => {
    if (refreshCount) {
      setText("");
    }
  }, [refreshCount]);

  useEffect(() => {
    (async () => {
      const response = await fetch(url);
      if (!response.body) {
        throw new Error(`Failed to load response from URL: ${url}`);
      }

      for await (const chunk of readStream(response.body)) {
        const text = DECODER.decode(chunk);
        setText((prev) => prev + text);
      }
    })();
  }, [url, refreshCount]);

  return [text, refresh];
};