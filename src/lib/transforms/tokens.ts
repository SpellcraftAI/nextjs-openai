import { CreateCompletionResponse } from "openai";
import { Transform } from ".";

export const OpenAITokenParser: Transform = async function* (chunk) {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

  const message: CreateCompletionResponse = JSON.parse(
    DECODER.decode(chunk)
  );

  const { text } = message?.choices?.[0];
  if (!text) return;

  yield ENCODER.encode(text);
};