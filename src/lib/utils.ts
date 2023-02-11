export type GeneratorFn<T> =
  (data: T) => Generator<T> | AsyncGenerator<T>;

/**
 * `compose(f, g, h, ...)` returns a generator function `G(data)` that yields
 * all `(f · g · h · ...)(data)`.
 */
export const compose = <T>(
  ...generators: GeneratorFn<T>[]
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
export const pipeline = <T>(
  stream: ReadableStream<T>,
  ...transforms: GeneratorFn<T>[]
) => {
  const composed = compose(...transforms);
  return generateStream(
    async function* () {
      for await (const chunk of yieldStream(stream)) {
        yield* composed(chunk);
      }
    }
  );
};

/**
 * Iterates over a stream, yielding each chunk.
 */
export const yieldStream = async function* <T>(
  stream: ReadableStream<T>,
  controller?: AbortController
) {
  const reader = stream.getReader();
  while (true) {
    if (controller?.signal.aborted) {
      break;
    }

    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    yield value;
  }
};

export type StreamGenerator<D, T, TReturn> =
  ((data?: D) => AsyncGenerator<T, TReturn>) |
  ((data?: D) => Generator<T, TReturn>);

/**
 * Creates a ReadableStream from a generator function.
 */
export const generateStream = <T, TReturn, D>(
  G: StreamGenerator<D, T, TReturn>,
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

/**
 * Creates a ReadableStream that yields all values in an array.
 */
export const streamArray = <T>(array: T[]) => {
  return generateStream(function* () {
    for (const item of array) {
      yield item;
    }
  });
};