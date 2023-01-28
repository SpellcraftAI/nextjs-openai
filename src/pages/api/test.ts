import { OpenAI } from "../../lib";

export default async function test() {
  const completionsStream = await OpenAI(
    "completions",
    {
      model: "text-davinci-003",
      prompt: "Write a paragraph.\n\n",
      temperature: 1,
      max_tokens: 200,
    }
  );

  return new Response(completionsStream);
}

export const config = {
  runtime: "edge",
};
