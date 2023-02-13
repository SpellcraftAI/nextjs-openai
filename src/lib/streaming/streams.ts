import { ENCODER, DECODER } from "../../globs";
import { TokenParser } from "./transforms";

import { createParser } from "eventsource-parser";
import { pipeline, yieldStream } from "yield-stream";

export type OpenAIStream =
  (stream: ReadableStream<Uint8Array>) => ReadableStream<Uint8Array>;

/**
 * A `ReadableStream` of server sent events from the given OpenAI API stream.
 */
export const EventStream: OpenAIStream = (stream) => {
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const parser = createParser((event) => {
        if (event.type === "event") {
          const { data } = event;
          /**
           * Break if event stream finished.
           */
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          /**
           * Verify we have a valid JSON object and then enqueue it.
           */
          try {
            JSON.parse(data);
            controller.enqueue(ENCODER.encode(data));
          } catch (e) {
            controller.error(e);
          }
        }
      });
      /**
       * Feed the parser with decoded chunks from the raw stream.
       */
      for await (const chunk of yieldStream(stream)) {
        parser.feed(DECODER.decode(chunk));
      }
    },
  });
};

/**
 * A `ReadableStream` of parsed tokens from the given OpenAI API stream.
 */
export const TokenStream: OpenAIStream = (stream) => {
  return pipeline(
    EventStream(stream),
    TokenParser
  );
};
