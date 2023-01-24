/* eslint-disable no-console */
import { CreateCompletionResponse } from "openai";

const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

export const ResultsTransform = async function* (chunk: Uint8Array) {
  const string = DECODER.decode(chunk).trim();
  const results = string.split("data: ");

  /**
   * Stream data can contain multiple results.
   */
  for (const result of results) {
    if (!result) continue;

    if (result === "[DONE]") {
      return;
    }

    yield ENCODER.encode(result);
  }
};

export const TokenTransform = async function* (chunk: Uint8Array) {
  console.log("TEST");
  console.log("TokenTransform", DECODER.decode(chunk));
  const message: CreateCompletionResponse = JSON.parse(
    DECODER.decode(chunk)
  );

  const { text } = message?.choices?.[0];
  if (!text) return;

  yield ENCODER.encode(text);
};