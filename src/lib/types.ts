import type { CreateCompletionRequest, CreateEditRequest, CreateEmbeddingRequest, CreateFineTuneRequest, CreateImageRequest } from "openai";

export type StreamMode = "raw" | "tokens";

export type OpenAIAPIEndpoint =
"completions" |
"edits" |
"embeddings" |
"images" |
"fine-tunes";

type OpenAIEndpointCreateProps = {
  "completions": Exclude<CreateCompletionRequest, "stream">;
  "edits": CreateEditRequest;
  "embeddings": CreateEmbeddingRequest;
  "images": CreateImageRequest;
  "fine-tunes": CreateFineTuneRequest;
};

export type OpenAICreateArgs<T extends OpenAIAPIEndpoint> =
  T extends "completions"
    ? Exclude<CreateCompletionRequest, "stream">
    : T extends "edits"
      ? CreateEditRequest
      : T extends "embeddings"
        ? CreateEmbeddingRequest
        : T extends "images"
          ? CreateImageRequest
          : T extends "fine-tunes"
            ? CreateFineTuneRequest
            : never;

export type OpenAIStream = <T extends OpenAIAPIEndpoint>(
  endpoint: T,
  args: OpenAICreateArgs<T>,
  mode?: StreamMode
) => Promise<ReadableStream<Uint8Array>>;


export type {
  CreateCompletionRequest,
  CreateEditRequest,
  CreateEmbeddingRequest,
  CreateFineTuneRequest,
  CreateImageRequest,
} from "openai";