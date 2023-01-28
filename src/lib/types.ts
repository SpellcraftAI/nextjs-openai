import type { CreateCompletionRequest, CreateEditRequest, CreateEmbeddingRequest, CreateFineTuneRequest, CreateImageRequest } from "openai";

export type StreamMode = "raw" | "tokens";

export type OpenAIAPIEndpoint =
"completions" |
"edits" |
"embeddings" |
"images" |
"fine-tunes";

export type OpenAICreateArgs =
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

export type Create = (
  endpoint: OpenAIAPIEndpoint,
  args: OpenAICreateArgs,
  mode?: StreamMode
) => Promise<ReadableStream<Uint8Array>>;