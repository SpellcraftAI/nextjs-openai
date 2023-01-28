export type Transform = (chunk: Uint8Array) => AsyncGenerator<Uint8Array>;

export const OpenAITokenParser: Transform = async function* (chunk) {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

  const decoded = DECODER.decode(chunk);
  const message = JSON.parse(decoded);

  const { text } = message?.choices?.[0];
  if (!text) {
    return;
  }

  yield ENCODER.encode(text);
};