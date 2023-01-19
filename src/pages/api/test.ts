import { ApiFunction, withEndpoint } from "next-endpoint";
import { Stream } from "stream";
import { pipeline } from "stream/promises";
import { OPENAI } from "../../globs/node";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function test(_: NextApiRequest, res: NextApiResponse) {
  // res.setHeader("Content-Type", "application/octet-stream");

  const textStream = new Stream();
  textStream.pipe(process.stdout);
  textStream.pipe(res);

  const completion = await OPENAI.createCompletion({
    model: "text-davinci-003",
    prompt: "Hi, this is just a test.\n\n",
    max_tokens: 200,
    stream: true,
  }, {
    responseType: "stream",
  });

  for await (const bytes of (completion.data as any)) {
    let string = bytes.toString("utf8");
    if (!string.startsWith("data:")) {
      break;
    }

    string = string.slice("data: ".length);
    if (!string.startsWith("[DONE]")) {
      try {
        const message = JSON.parse(string);
        const { text } = message.choices[0];
        textStream.emit("data", text);
      } catch (error) {
        console.log({ string, error });
      }
    }
  }

  textStream.emit("end");
  console.log("\n---\n");
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };