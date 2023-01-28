import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

import { CreateCompletionRequest } from "openai";
import { OPENAI_API_KEY } from "../globs/node";
import { readStream } from "./utils";

export async function OpenAIStream(config: CreateCompletionRequest) {
  const ENCODER = new TextEncoder();
  const DECODER = new TextDecoder();

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

  let counter = 0;
  const stream = new ReadableStream({
    async start(controller) {
      const parser = createParser((event) => {
        if (event.type === "event") {
          const { data } = event;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].text;
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }

            const queue = ENCODER.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      });

      if (!res.body) {
        throw new Error("No response body");
      }

      for await (const chunk of readStream(res.body)) {
        parser.feed(DECODER.decode(chunk));
      }
    },
  });

  return stream;
}