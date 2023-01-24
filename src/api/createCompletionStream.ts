import { OpenAIApi } from "openai";
import { Readable } from "stream";
import { OPENAI } from "../globs/node";
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
  const completion = await OPENAI.createCompletion({
    ...args,
    stream: true,
  }, {
    responseType: "stream",
  });

  const stream = completion.data as unknown as Readable;
  switch (mode) {
    case "raw":
      return ResultStream(stream);
    case "tokens":
      return TokenStream(stream);
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
};