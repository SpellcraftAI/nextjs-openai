import { ResultsTransform, TokenTransform } from "./transforms";
import { pipeline } from "./utils";

export const ResultStream = (stream: ReadableStream) => {
  return pipeline(
    stream,
    ResultsTransform
  );
};

/**
 * Receives a stream of prompt completion objects as JSON, emits a stream of
 * parsed tokens.
 */
export const TokenStream = (stream: ReadableStream) => {
  return pipeline(
    stream,
    ResultsTransform,
    TokenTransform
  );
};
