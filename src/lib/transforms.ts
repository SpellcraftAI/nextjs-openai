/* eslint-disable no-console */
import { CreateCompletionResponse } from "openai";

// export const Buffer = (size = 1024 * 1024) => {
//   const buffer = new ArrayBuffer(size);
//   const view = new Uint8Array(buffer);

//   return async function* (chunk: Uint8Array) {
//     let offset = 0;

//     for (let i = 0; i < chunk.length; i++) {
//       view[offset] = chunk[i];
//       offset++;

//       if (offset === size) {
//         yield new Uint8Array(buffer);
//         offset = 0;
//       }
//     }

//     if (offset > 0) {
//       yield new Uint8Array(buffer.slice(0, offset));
//     }
//   };
// };

/**
 * Yields data from an OpenAI stream.
 */
export const DataTransform = async function* (chunk: Uint8Array) {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

  console.log("DataTransform", DECODER.decode(chunk));
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

/**
 * Yields JSON from the incoming stream, which may arrive in incomplete chunks.
 * We track a buffer and append incoming chunks to it until we have a complete
 * JSON object, then yield that.
 */
export const JSONTransform = async function* (chunk: Uint8Array) {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

  let buffer = DECODER.decode(chunk);
  while (true) {
    console.log("JSONTransform", { buffer });
    try {
      JSON.parse(buffer);
      yield ENCODER.encode(buffer);
      break;
    } catch (e) {
      buffer += DECODER.decode(chunk);
      console.log("Error");
    }
  }
};

export const TokenTransform = async function* (chunk: Uint8Array) {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

  console.log("TEST");
  console.log("TokenTransform", DECODER.decode(chunk));
  const message: CreateCompletionResponse = JSON.parse(
    DECODER.decode(chunk)
  );

  const { text } = message?.choices?.[0];
  if (!text) return;

  yield ENCODER.encode(text);
};