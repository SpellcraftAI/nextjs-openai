import { Stream } from "stream";

/**
 * `text` is a stream of strings, and `raw` is the raw stream of JSON objects
 * sent by OpenAI.
 */
export type StreamMode = "text" | "raw";

/**
 * Parse the OpenAI completion stream.
 *
 * @param stream The raw OpenAI completion stream.
 * @param mode Whether to parse as text or leave raw.
 * @returns A stream of parsed data.
 */
export const parseStream = (
  stream: any,
  mode: StreamMode = "text"
) => {
  const parsedStream = new Stream();

  stream.on("data", (bytes: any) => {
    const string = bytes.toString("utf8").trim();

    const results = string.split("data: ");
    for (const result of results) {
      if (!result) continue;

      if (result === "[DONE]") {
        parsedStream.emit("end");
        return;
      }

      try {
        const message = JSON.parse(result);
        switch (mode) {
          case "text":
            const { text } = message.choices[0];
            parsedStream.emit("data", text);
            break;

          case "raw":
            parsedStream.emit("data", message);
            break;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log({ string, error });
      }
    }
  });

  return parsedStream;
};