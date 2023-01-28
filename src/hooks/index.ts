import { DispatchWithoutAction, useEffect, useReducer, useState } from "react";
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
      if (!response.body) return;

      for await (const chunk of readStream(response.body)) {
        const text = new TextDecoder().decode(chunk);
        setText((prev) => prev + text);
      }
    })();
  }, [url, refreshCount]);

  return [text, refresh];
};