import { OpenAITokenParser, PartialJsonParser, SSEParser } from "./transforms";
import { pipeline } from "./utils";

export const ResultStream = (stream: ReadableStream) => {
  return pipeline(
    stream,
    [
      SSEParser,
      PartialJsonParser,
    ]
  );
};

/**
 * Receives a stream of prompt completion objects as JSON, emits a stream of
 * parsed tokens.
 */
export const TokenStream = (stream: ReadableStream) => {
  return pipeline(
    stream,
    [
      SSEParser,
      // PartialJsonParser,
      OpenAITokenParser
    ]
  );
};
