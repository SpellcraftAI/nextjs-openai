import { CreateCompletionRequest } from "openai";
import { OPENAI_API_KEY } from "../globs/node";
import { OpenAIServerSentEvents } from "./streams";
import { OpenAITokenParser } from "./transforms";
import { pipeline } from "./utils";

export async function OpenAIStream(config: CreateCompletionRequest) {
  const res = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify({
      ...config,
      stream: true,
    }),
  });

  if (!res.body) {
    throw new Error("No response body");
  }

  return pipeline(
    OpenAIServerSentEvents(res.body),
    [OpenAITokenParser]
  );
}