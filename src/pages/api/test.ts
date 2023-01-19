import { ApiFunction, withEndpoint } from "next-endpoint";
import { Stream } from "stream";
import { pipeline } from "stream/promises";
import { OPENAI } from "../../globs/node";

import type { NextApiRequest, NextApiResponse } from "next";
import { createCompletion } from "../../lib/createCompletionStream";

export default async function test(_: NextApiRequest, res: NextApiResponse) {
  const stream = await createCompletion({
    model: "text-davinci-003",
    prompt: "Hi, this is just a test.\n\n",
    max_tokens: 200,
  });

  stream.pipe(process.stdout);
  stream.pipe(res);

  // eslint-disable-next-line no-console
  stream.on("end", () => console.log());
}
