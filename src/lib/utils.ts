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
 * Runs each chunk through all of the given transforms.
 */
export const pipeline = <D = Uint8Array>(
  stream: ReadableStream<D>,
  ...transforms: GeneratorFn<D>[]
) => {
  const composed = compose(...transforms);
  return createStream(
    async function* () {
      for await (const chunk of readStream(stream)) {
        yield* composed(chunk);
      }
    }
  );
};

/**
 * Iterates over a stream, yielding each chunk.
 */
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

/**
 * Creates a ReadableStream from a generator function.
 */
export const createStream = <T, TReturn, D>(
  G: (
    ((data?: D) => AsyncGenerator<T, TReturn>) |
    ((data?: D) => Generator<T, TReturn>)
  ),
  data?: D
) => {
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of G(data)) {
        controller.enqueue(chunk);
      }

      controller.close();
    },
  });
};