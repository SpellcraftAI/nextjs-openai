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
  transforms: GeneratorFn<D>[],
) => {
  const composed = compose(...transforms);
  return generateStream(
    async function* () {
      for await (const chunk of readStream(stream)) {
        yield* composed(chunk);
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

export const generateStream = <T, TReturn>(
  G: (
    Generator<T, TReturn> |
    AsyncGenerator<T, TReturn> |
    (() => AsyncGenerator<T, TReturn>) |
    (() => Generator<T, TReturn>)
  )
) => {
  const generator = typeof G === "function" ? G() : G;

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of generator) {
        controller.enqueue(chunk);
      }

      controller.close();
    },
  });
};