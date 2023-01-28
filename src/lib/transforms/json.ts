import { Transform } from "../transforms";

/**
 * Incoming chunks that contain partial JSON will be stored in memory until they
 * consist of a complete JSON string.
 */
let JSON_MEMORY = "";

/**
 * A generator that reduces the incoming parts of a JSON string into a single
 * string. Uses `JSON.parse` to determine when the string is complete.
 */
export const PartialJsonParser: Transform = async function* (bytes) {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

  const string = DECODER.decode(bytes);
  JSON_MEMORY += string;
  // eslint-disable-next-line no-console
  console.log({ JSON_MEMORY });

  try {
    JSON.parse(JSON_MEMORY);
    yield ENCODER.encode(JSON_MEMORY);

    JSON_MEMORY = "";
  } catch (error) {}
};