import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai-streams";
import { Readable } from "stream";
import { yieldStream } from "yield-stream";

export default async function demo(req: NextApiRequest, res: NextApiResponse) {
  const { name } = JSON.parse(req.body);
  if (!name) {
    return res.status(400).send("Did not include `name` parameter");
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

  Readable.from(yieldStream(completionsStream)).pipe(res);
}
