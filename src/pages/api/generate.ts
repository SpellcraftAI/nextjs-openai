import type { NextRequest } from "next/server";
import { CreateCompletionRequest } from "openai";
import { OpenAIStream } from "../../lib/openai";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest): Promise<Response> => {
  const prompt = req.nextUrl.searchParams.get("prompt");

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: CreateCompletionRequest = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;