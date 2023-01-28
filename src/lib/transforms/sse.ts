import { createParser } from "eventsource-parser";
import { Transform } from ".";

const parse = async function* () {
  const parser = createParser((event) => {
    // eslint-disable-next-line no-console
    console.log(event);
    if (event.type === "event") {
      const { data } = event;
      if (data === "[DONE]") return;
    }
  });
};

/**
 * Yields Server Side Event data from an OpenAI stream.
 */
export const SSEParser: Transform = async function* (chunk) {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

  yield new Promise<Uint8Array>((resolve) => {
    const parser = createParser((event) => {
      // eslint-disable-next-line no-console
      // console.log(event);
      if (event.type === "event") {
        const { data } = event;
        resolve(ENCODER.encode(data));
      }
    });

    parser.feed(DECODER.decode(chunk));
  });
};