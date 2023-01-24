import { Readable } from "stream";
import { ResultsTransform, TokenTransform } from "./transforms";
import { pipeline } from "./utils";

export const ResultStream = (stream: Readable) => {
  return pipeline(
    stream,
    ResultsTransform
  );
};

/**
 * Receives a stream of prompt completion objects as JSON, emits a stream of
 * parsed tokens.
 */
export const TokenStream = (stream: Readable) => {
  return pipeline(
    stream,
    ResultsTransform,
    TokenTransform
  );
};
