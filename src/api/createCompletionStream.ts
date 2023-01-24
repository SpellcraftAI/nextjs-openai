import { OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "../globs/node";
import { ResultStream, TokenStream } from "../lib/streams";

export type StreamMode = "raw" | "tokens";
export type CreateCompletionParams = Parameters<OpenAIApi["createCompletion"]>[0];

export interface CreateCompletionArgs extends Exclude<CreateCompletionParams, "stream"> {
  mode?: StreamMode;
}

/**
 * Create a new completion stream. Stream of strings by default, set `mode:
 * 'raw'` for the raw stream of JSON objects.
 */
export const createCompletion = async ({
  mode = "tokens",
  ...args
}: CreateCompletionArgs) => {
  const completion = await fetch(
    "https://api.openai.com/v1/completions",
    {
      method: "POST",
      body: JSON.stringify({
        ...args,
        stream: true,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
    }
  );

  const completionStream = new ReadableStream({
    async start(controller) {
      if (!completion.body || completion.status !== 200) {
        throw new Error("Completion failed.");
      }

      const reader = completion.body.getReader();
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          controller.close();
          break;
        }

        controller.enqueue(value);
      }
    }
  });

  switch (mode) {
    case "raw":
      return ResultStream(completionStream);
    case "tokens":
      return TokenStream(completionStream);
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
};