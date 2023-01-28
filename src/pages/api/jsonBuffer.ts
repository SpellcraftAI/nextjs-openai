import { SSEParser, OpenAITokenParser, PartialJsonParser } from "../../lib/transforms";
import { generateStream, pipeline } from "../../lib/utils";

async function* simulate () {
  const ENCODER = new TextEncoder();

  yield ENCODER.encode("data: { \"choices\": [ { \"text\": ");
  yield ENCODER.encode("data: \"Hello, Alice!\" } ] }\n\n");
  yield ENCODER.encode("data: { \"choices\": [");
  yield ENCODER.encode("data: { \"text\": \"Hello, Bob!\" } ] }\n\n");
}

export default async function handler() {
  const simulated = generateStream(simulate);

  return new Response(
    pipeline(
      simulated,
      [
        SSEParser,
        PartialJsonParser,
        OpenAITokenParser,
      ],
    ),
  );
}

export const config = {
  runtime: "edge",
};