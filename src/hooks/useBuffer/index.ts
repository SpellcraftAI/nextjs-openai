import { useCallback, useEffect, useReducer, useRef } from "react";
import { yieldStream } from "yield-stream";
import { BufferHook } from "../types";
import { State, streamState } from "./state";

/**
 * Fetch a stream from a URL and return the updated buffer as it is received.
 *
 * @category Hooks
 *
 * @example
 * ```tsx
 * const { buffer, done, refresh } = useBuffer(url, 500);
 * // ...
 * ```
 */
export const useBuffer: BufferHook = ({
  url,
  throttle = 0,
  data = null,
  options = {}
}) => {
  const initialState: State = {
    done: false,
    buffer: [],
    refreshCount: 0,
    aborted: false,
    controller: null,
    error: null,
  };

  const [state, dispatch] = useReducer(streamState, initialState);
  const optionsRef = useRef(options);
  const { done, buffer, refreshCount, error } = state;

  const streamChunks = useCallback(
    async (
      stream: AsyncGenerator<Uint8Array>,
      delay: number
    ) => {
      let lastUpdateTime = 0;

      for await (const chunk of stream) {
        dispatch({ type: "add", payload: chunk });

        if (delay) {
          const timeSinceLastUpdate = Date.now() - lastUpdateTime;
          const timeToWait = Math.max(0, delay - timeSinceLastUpdate);

          await new Promise((resolve) => setTimeout(resolve, timeToWait));
          lastUpdateTime = Date.now();
        }
      }
      dispatch({ type: "done" });
    },
    [dispatch]
  );

  /**
   * Fetch the new token stream.
   */
  useEffect(
    () => {
      const newController = new AbortController();
      dispatch({ type: "setController", payload: newController });

      let animation: number;
      (async () => {
        try {
          const { method = "POST" } = optionsRef.current;
          const { signal } = newController;

          const response = await fetch(
            url,
            {
              signal,
              method,
              body:
              method === "POST" && data
                ? JSON.stringify(data)
                : undefined,
              ...optionsRef?.current,
            }
          );

          if (!response.ok || !response.body) {
            const errorText = `[${response.status}] ${response.statusText}`;

            if (response.body) {
              const error = await response.text();
              throw new Error(`${errorText}\n\n${error}`);
            } else {
              throw new Error(errorText);
            }
          }

          const stream = yieldStream(response.body, newController);
          animation = requestAnimationFrame(
            () => streamChunks(stream, throttle)
          );
        } catch (error) {
          if (error instanceof Error) {
            const { name, message } = error;
            dispatch({ type: "setError", payload: { name, message } });
          }
        }
      })().catch();

      return () => {
        cancelAnimationFrame(animation);
        if (newController) {
          newController.abort();
          dispatch({ type: "cancel" });
        }
      };
    },
    [refreshCount, url, throttle, streamChunks, data]
  );

  return {
    buffer,
    done,
    error,
    refresh: () => dispatch({ type: "refresh" }),
    cancel: () => dispatch({ type: "cancel" }),
  };
};
