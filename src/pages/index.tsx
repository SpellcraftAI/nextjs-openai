import Head from "next/head";
import { DispatchWithoutAction, useEffect, useReducer, useState } from "react";

type TextStreamAction = {
  type: "append" | "reset",
  text: string,
};

function textStreamReducer(
  text: string,
  action: TextStreamAction
) {
  switch (action.type) {
    case "append":
      text += action.text;
      break;
    case "reset":
      text = action.text;
      break;
    default:
      throw new Error();
  }

  return text;
}

/**
 * Custom hook that returns a string with the current text of the token stream.
 */
export const useTokenStream = (
  url: string
): [string, DispatchWithoutAction] => {
  const [text, dispatch] = useReducer(textStreamReducer, "");
  const [refreshCount, refresh] = useReducer(x => x + 1, 0);

  useEffect(() => {
    if (refreshCount) {
      dispatch({ type: "reset", text: "" });
    }
  }, [refreshCount]);

  useEffect(() => {
    (async () => {
      const response = await fetch(url);
      if (!response?.body) return;

      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder("utf-8").decode(value);
        dispatch({ type: "append", text });
      }

    })();
  }, [url, refreshCount]);

  return [text, refresh];
};

export default function Home() {
  const [text, refresh] = useTokenStream("http://localhost:3000/api/test");

  return (
    <>
      <Head>
        <title>OpenAI Completion Stream</title>
      </Head>

      <main>
        <div className="w-full max-w-md p-4 rounded-lg border-solid border-2 border-gray-400">
          <p>{text}</p>
        </div>
        <button onClick={refresh}>Refresh</button>
      </main>

    </>
  );
}
