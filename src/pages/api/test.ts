import type { NextApiRequest, NextApiResponse } from "next";
import { createCompletion } from "../../api/createCompletionStream";

export default async function test(_: NextApiRequest, res: NextApiResponse) {
  const stream = await createCompletion({
    model: "text-davinci-003",
    prompt: "Hi, this is just a test.\n\n",
    temperature: 1,
    max_tokens: 200,
  });

  res.setHeader("Transfer-Encoding", "chunked");

  stream.pipe(process.stdout);
  stream.pipe(res);
}

export const config = {
  // runtime: "edge",
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};
