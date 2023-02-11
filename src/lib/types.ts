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
OpenAIEndpointCreateProps[T];

export type OpenAIStream = (
  endpoint: OpenAIAPIEndpoint,
  args: OpenAICreateArgs<typeof endpoint>,
  mode?: StreamMode
) => Promise<ReadableStream<Uint8Array>>;

export type {
  CreateCompletionRequest,
  CreateEditRequest,
  CreateEmbeddingRequest,
  CreateFineTuneRequest,
  CreateImageRequest,
} from "openai";