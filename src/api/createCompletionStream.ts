import { OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "../globs/node";
import { ResultStream, TokenStream } from "../lib/streams";
// import { readStream } from "../lib/utils";

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

  if (!response.body) {
    throw new Error("No response body");
  }

  switch (mode) {
    case "raw":
      return ResultStream(response.body);
    case "tokens":
      return TokenStream(response.body);
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
};