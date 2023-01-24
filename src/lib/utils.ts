export type GeneratorFn<Data> =
  (data: Data) => Generator<Data> | AsyncGenerator<Data>;

export type StreamGenerator<Data = Uint8Array> =
  () => Generator<Data> | AsyncGenerator<Data>;

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
  stream: ReadableStream<D>,
  ...transforms: GeneratorFn<D>[]
) => {
  const composed = compose(...transforms);
  return readGenerator(
    async function* () {
      for await (const result of readStream(stream)) {
        for await (const chunk of composed(result)) {
          yield chunk;
        }
      }
    }
  );
};

export const readStream = async function* <D = Uint8Array>(
  stream: ReadableStream<D>
) {
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    yield value;
  }
};

export const readGenerator = <Data = Uint8Array>(
  G: StreamGenerator<Data>
) => {
  return new ReadableStream<Data>({
    async pull(controller) {
      for await (const chunk of G()) {
        controller.enqueue(chunk);
      }

      controller.close();
    }
  });
};