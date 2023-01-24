import type { NextApiRequest, NextApiResponse } from "next";
import { createCompletion } from "../../api/createCompletionStream";

export default async function test(_: NextApiRequest, res: NextApiResponse) {
  const stream = await createCompletion({
    model: "text-davinci-003",
    prompt: "Hi, this is just a test.\n\n",
    temperature: 1,
    max_tokens: 200,
  });

  return new Response(stream, {
    /**
     * Use headers for streaming.
     */
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
}

export const config = {
  runtime: "edge",
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};
