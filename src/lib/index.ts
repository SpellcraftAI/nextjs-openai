import { OPENAI_API_KEY } from "../globs/node";
import { EventStream, TokenStream } from "./streams";
import { Create } from "./types";

/**
 * Create a new completion stream. Stream of strings by default, set `mode:
 * 'raw'` for the raw stream of JSON objects.
 */
export const OpenAI: Create = async (
  endpoint,
  {
    ...args
  },
  mode = "tokens"
) => {
  const response = await fetch(
    `https://api.openai.com/v1/${endpoint}`,
    {
      method: "POST",
      body: JSON.stringify({
        ...args,
        stream: true,
      }),
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }
  );

  if (!response.body) {
    throw new Error("No response body");
  }

  switch (mode) {
    case "tokens":
      return TokenStream(response.body);
    case "raw":
      return EventStream(response.body);
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
};