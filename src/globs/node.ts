import { Configuration, OpenAIApi } from "openai";

/**
 * OpenAI config and client.
 */

export const { OPENAI_API_KEY, TWITTER_BEARER_TOKEN } = process.env;

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined.");
}

export const OPENAI_CONFIG = new Configuration({
  apiKey: OPENAI_API_KEY,
});

export const OPENAI = new OpenAIApi(OPENAI_CONFIG);