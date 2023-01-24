import { DataTransform, JSONTransform, TokenTransform } from "./transforms";
import { pipeline } from "./utils";

export const ResultStream = (stream: ReadableStream) => {
  return pipeline(
    stream,
    DataTransform
  );
};

/**
 * Receives a stream of prompt completion objects as JSON, emits a stream of
 * parsed tokens.
 */
export const TokenStream = (stream: ReadableStream) => {
  return pipeline(
    stream,
    DataTransform,
    JSONTransform,
    TokenTransform
  );
};
