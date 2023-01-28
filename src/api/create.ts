import { CreateCompletionRequest, CreateEditRequest, CreateEmbeddingRequest, CreateFineTuneRequest, CreateImageRequest } from "openai";
import { OPENAI_API_KEY } from "../globs/node";
import { EventStream, TokenStream } from "../lib/streams";

export type StreamMode = "raw" | "tokens";

export type OpenAIAPIEndpoint =
"completions" |
"edits" |
"embeddings" |
"images" |
"fine-tunes";

type OpenAICreateArgs =
Exclude<
(
  CreateCompletionRequest |
  CreateEditRequest |
  CreateEmbeddingRequest |
  CreateImageRequest |
  CreateFineTuneRequest
),
"stream"
>;

export type CreateArgs =
  OpenAICreateArgs  & { mode?: StreamMode };

export type Create = (
  endpoint: OpenAIAPIEndpoint,
  args: CreateArgs
) => Promise<ReadableStream<Uint8Array>>;

/**
 * Create a new completion stream. Stream of strings by default, set `mode:
 * 'raw'` for the raw stream of JSON objects.
 */
export const create: Create = async (
  endpoint,
  {
    mode = "tokens",
    ...args
  }
) => {
  const response = await fetch(
    `https://api.openai.com/v1/${endpoint}`,
    {
      method: "POST",
      body: JSON.stringify({
        ...args,
        stream: true,
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
      return EventStream(response.body);
    case "tokens":
      return TokenStream(response.body);
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
};