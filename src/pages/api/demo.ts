import { OpenAI } from "../..";

export default async function test() {
  const completionsStream = await OpenAI(
    // "edits",
    "completions",
    {
      // model: "text-davinci-edit-001",
      // input: "What day of the wek is it?",
      // instruction: "Fix the spelling mistakes",
      model: "text-davinci-003",
      prompt: "Write a two-sentence paragraph.\n\n",
      temperature: 1,
      max_tokens: 100,
    },
  );

  return new Response(completionsStream);
}

export const config = {
  runtime: "edge",
};
