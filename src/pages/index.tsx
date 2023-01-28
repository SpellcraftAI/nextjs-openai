import Head from "next/head";
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

export default function Home() {
  const [text, refresh] = useTokenStream("/api/test");

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
