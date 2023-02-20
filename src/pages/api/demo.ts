import { NextRequest } from "next/server";
import { OpenAI } from "openai-streams";

export default async function demo(req: NextRequest) {
  const { name } = await req.json();
  if (!name) {
    return new Response(null, { status: 400, statusText: "Did not include `name` parameter" });
  }

  const completionsStream = await OpenAI(
    // "edits",
    "completions",
    {
      // model: "text-davinci-edit-001",
      // input: "What day of the wek is it?",
      // instruction: "Fix the spelling mistakes",
      model: "text-davinci-003",
      prompt: `Write a nice two-sentence paragraph about a person named ${name}.\n\n`,
      temperature: 1,
      max_tokens: 100,
    },
  );

  return new Response(completionsStream);
}

export const config = {
  runtime: "edge",
};
