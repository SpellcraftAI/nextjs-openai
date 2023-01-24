import { Readable, Stream } from "stream";

export type GeneratorFn<Data> =
  (data: Data) => Generator | AsyncGenerator;

/**
 * `compose(f, g, h, ...)` returns a generator function `G(data)` that yields
 * all `(f · g · h · ...)(data)`.
 */
export const compose = <Data>(
  ...generators: GeneratorFn<Data>[]
) => {
  return generators.reduce(
    (prev, next) => async function* (data) {
      for await (const chunk of prev(data)) {
        yield* next(chunk as Data);
      }
    },
  );
};

/**
 * Create an http-server-compatible stream pipeline. Transforms are composed and
 * applied in one step.
 */
export const pipeline = (
  stream: Readable,
  ...transforms: GeneratorFn<Buffer>[]
) => {
  const output = new Stream();
  const composed = compose(...transforms);

  stream.on("end", () => output.emit("end"));
  stream.on("data", async (chunk: Buffer) => {
    for await (const result of composed(chunk)) {
      output.emit("data", result);
    }
  });

  return output;
};