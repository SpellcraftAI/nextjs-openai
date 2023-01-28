import { createCompletion } from "../../api/createCompletionStream";

export default async function test() {
  const completionsStream = await createCompletion({
    model: "text-davinci-003",
    prompt: "Hi, this is just a test.\n\n",
    temperature: 1,
    max_tokens: 200,
  });

  return new Response(completionsStream, {
    /**
     * Use headers for streaming.
     */
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export const config = {
  runtime: "edge",
};
