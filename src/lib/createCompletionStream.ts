import { OpenAIApi } from "openai";
import { OPENAI } from "../globs/node";
import { parseStream, StreamMode } from "./parseStream";

type CreateCompletionParams = Parameters<OpenAIApi["createCompletion"]>[0];

interface CreateCompletionArgs extends Exclude<CreateCompletionParams, "stream"> {
  mode?: StreamMode;
}

/**
 * Create a new completion stream. Stream of strings by default, set `mode:
 * 'raw'` for the raw stream of JSON objects.
 */
export const createCompletion = async ({
  mode,
  ...args
}: CreateCompletionArgs) => {
  const completion = await OPENAI.createCompletion({
    ...args,
    stream: true,
  }, {
    responseType: "stream",
  });

  return parseStream((completion.data as any), mode);
};