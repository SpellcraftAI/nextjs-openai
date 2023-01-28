import { CreateCompletionResponse } from "openai";
import { Transform } from ".";

export const OpenAITokenParser: Transform = async function* (chunk) {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

  const decoded = DECODER.decode(chunk);
  if (decoded === "[DONE]") {
    return;
  }

  const message: CreateCompletionResponse = JSON.parse(decoded);
  const { text } = message?.choices?.[0];
  if (!text) {
    return;
  }

  yield ENCODER.encode(text);
};