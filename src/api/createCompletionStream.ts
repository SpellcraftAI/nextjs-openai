import { OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "../globs/node";
import { ResultStream, TokenStream } from "../lib/streams";
import { readStream } from "../lib/utils";

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
  stream = true,
  ...args
}: CreateCompletionArgs) => {
  const response = await fetch(
    "https://api.openai.com/v1/completions",
    {
      method: "POST",
      body: JSON.stringify({
        ...args,
        stream,
      }),
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }
  );

  const completionStream = new ReadableStream({
    async pull(controller) {
      if (!response.ok || !response.body) {
        throw new Error("Completion failed.");
      }

      for await (const chunk of readStream(response.body)) {
        controller.enqueue(chunk);
      }

      controller.close();
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