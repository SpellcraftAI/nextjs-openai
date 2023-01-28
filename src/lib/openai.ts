import {
  createParser,
} from "eventsource-parser";

import { CreateCompletionRequest } from "openai";
import { OPENAI_API_KEY } from "../globs/node";
import { OpenAITokenParser } from "./transforms";
import { pipeline, readStream } from "./utils";

const parseServerSentEvents = (stream: ReadableStream) => {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const parser = createParser((event) => {
        if (event.type === "event") {
          const { data } = event;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            JSON.parse(data);
            controller.enqueue(ENCODER.encode(data));
          } catch (e) {
            controller.error(e);
          }
        }
      });

      for await (const chunk of readStream(stream)) {
        parser.feed(DECODER.decode(chunk));
      }
    },
  });
};

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
    parseServerSentEvents(res.body),
    [OpenAITokenParser]
  );
}