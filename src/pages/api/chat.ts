import { NextRequest } from "next/server";
import { OpenAI } from "openai-streams";

export default async function demo(req: NextRequest) {
  // return new Response("Testing error.", { status: 401 });
  // throw new Error("test");

  const { name } = await req.json();
  if (!name) {
    return new Response(null, { status: 400, statusText: "Did not include `name` parameter" });
  }

  const completionsStream = await OpenAI(
    "chat",
    {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `Write a nice two-sentence paragraph about a person named ${name}.\n\n`, }
      ],
    },
  );

  return new Response(completionsStream);
}

export const config = {
  runtime: "edge",
};