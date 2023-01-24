export type GeneratorFn<Data> =
  (data: Data) => Generator<Data> | AsyncGenerator<Data>;

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
        yield* next(chunk);
      }
    },
  );
};

/**
 * Create an http-server-compatible stream pipeline. Transforms are composed and
 * applied in one step.
 */
export const pipeline = <D = Uint8Array>(
  stream: ReadableStream,
  ...transforms: GeneratorFn<D>[]
) => {
  const composed = compose(...transforms);
  return new ReadableStream<D>({
    async pull(controller) {
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          controller.close();
          break;
        }

        for await (const result of composed(value)) {
          controller.enqueue(result);
        }
      }
    }
  });
};