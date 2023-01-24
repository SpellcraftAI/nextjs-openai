import { CreateCompletionResponse } from "openai";

export const ResultsTransform = async function* (chunk: Buffer) {
  const string = chunk.toString("utf-8").trim();
  const results = string.split("data: ");

  /**
   * Stream data can contain multiple results.
   */
  for (const result of results) {
    if (!result) continue;

    if (result === "[DONE]") {
      return;
    }

    yield Buffer.from(result, "utf-8");
  }
};

export const TokenTransform = async function* (chunk: Buffer) {
  const message: CreateCompletionResponse = JSON.parse(chunk.toString("utf-8"));

  const { text } = message?.choices?.[0];
  if (!text) return;

  yield Buffer.from(text, "utf-8");
};