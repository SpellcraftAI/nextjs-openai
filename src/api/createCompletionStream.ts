import { CreateCompletionRequest, CreateEditRequest, CreateEmbeddingRequest, CreateFineTuneRequest, CreateImageRequest } from "openai";
import { OPENAI_API_KEY } from "../globs/node";
import { OpenAIEventStream, OpenAITokenStream } from "../lib/streams";
// import { readStream } from "../lib/utils";

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

/**
 * Create a new completion stream. Stream of strings by default, set `mode:
 * 'raw'` for the raw stream of JSON objects.
 */
export const create = async (
  endpoint: OpenAIAPIEndpoint,
  {
    mode = "tokens",
    ...args
  }: CreateArgs
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
      return OpenAIEventStream(response.body);
    case "tokens":
      return OpenAITokenStream(response.body);
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
};