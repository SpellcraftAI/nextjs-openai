import { createParser } from "eventsource-parser";
import { Transform } from ".";

/**
 * Yields Server Side Event data from an OpenAI stream.
 */
export const SSEParser: Transform = async function* (chunk) {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

  yield new Promise<Uint8Array>((resolve) => {
    const parser = createParser((event) => {
      if ("data" in event) {
        resolve(ENCODER.encode(event.data));
      }
    });

    parser.feed(DECODER.decode(chunk));
  });
};