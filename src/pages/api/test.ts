/* eslint-disable no-console */
import { create } from "../../api/createCompletionStream";
// import { OpenAIStream } from "../../lib/openai";

export default async function test() {
  const completionsStream = await create(
    "completions",
    {
      model: "text-davinci-003",
      prompt: "Hi, this is just a test.\n\n",
      temperature: 1,
      max_tokens: 200,
    }
  );

  return new Response(completionsStream);
}

export const config = {
  runtime: "edge",
};
