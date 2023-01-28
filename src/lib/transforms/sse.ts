import { Transform } from ".";

const SSE_DATA_PREFIX = "data: ";

/**
 * Yields Server Side Event data from an OpenAI stream.
 */
export const SSEParser: Transform = async function* (chunk) {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

  const string = DECODER.decode(chunk);
  const sseChunks = string.split("\n\n").filter(Boolean);

  for (const sseChunk of sseChunks) {
    if (!sseChunk) continue;
    if (!sseChunk.startsWith(SSE_DATA_PREFIX)) continue;

    const data = sseChunk.slice(SSE_DATA_PREFIX.length);
    // eslint-disable-next-line no-console
    console.log({ data });
    if (data === "[DONE]") {
      return;
    }

    yield ENCODER.encode(data);
  }
};