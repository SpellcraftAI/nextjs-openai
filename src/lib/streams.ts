import { createParser } from "eventsource-parser";
import { OpenAITokenParser } from "./transforms";
import { pipeline, readStream } from "./utils";

export type OpenAIStream =
  (stream: ReadableStream<Uint8Array>) => ReadableStream<Uint8Array>;

export const OpenAIEventStream: OpenAIStream = (stream) => {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const parser = createParser((event) => {
        if (event.type === "event") {
          const { data } = event;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            JSON.parse(data);
            controller.enqueue(ENCODER.encode(data));
          } catch (e) {
            controller.error(e);
          }
        }
      });

      for await (const chunk of readStream(stream)) {
        parser.feed(DECODER.decode(chunk));
      }
    },
  });
};

/**
 * Receives a stream of prompt completion objects as JSON, emits a stream of
 * parsed tokens.
 */
export const OpenAITokenStream: OpenAIStream = (stream) => {
  return pipeline(
    OpenAIEventStream(stream),
    [OpenAITokenParser]
  );
};
