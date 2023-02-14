import { OpenAI } from "../../lib";

export default async function test() {
  const config = {
    // model: "text-davinci-edit-001",
    // input: "What day of the wek is it?",
    // instruction: "Fix the spelling mistakes",
    model: "text-davinci-003",
    prompt: "Write a sentence.\n\n",
    temperature: 1,
    max_tokens: 100,
  };

  const completionsStream = await OpenAI(
    // "edits",
    "completions",
    config,
  );

  return new Response(completionsStream);
}

export const config = {
  runtime: "edge",
};
