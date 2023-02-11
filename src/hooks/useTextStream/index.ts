import { Reducer, useEffect, useReducer } from "react";
import { DECODER } from "../../globs/shared";
import { yieldStream } from "../../lib/utils";

type State = {
  buffer: string[];
  refreshCount: number;
  aborted: boolean;
  controller: AbortController | null;
};

type Action =
  | { type: "cancel" }
  | { type: "refresh" }
  | { type: "reset" }
  | { type: "add"; payload: string }
  | { type: "setController"; payload: AbortController };

const textStreamReducer: Reducer<State, Action> = (prevState, action) => {
  switch (action.type) {
    case "cancel":
      return { ...prevState, aborted: true };
    case "refresh":
      return {
        ...prevState,
        aborted: true,
        refreshCount: prevState.refreshCount + 1,
      };
    case "reset":
      return {
        ...prevState,
        aborted: false,
        buffer: [],
      };
    case "add":
      return {
        ...prevState,
        aborted: false,
        buffer: prevState.buffer.concat(action.payload),
      };
    case "setController":
      return {
        ...prevState,
        controller: action.payload
      };
    default:
      return prevState;
  }
};

/**
 * Custom hook that updates with the current token buffer.
 *
 * @note Thanks to GPT for guidance on AbortControllers and fucked up state
 * logic.
 */
export const useTextStream = (
  url: string
) => {
  const [state, dispatch] = useReducer(
    textStreamReducer,
    {
      buffer: [],
      refreshCount: 0,
      aborted: false,
      controller: null,
    }
  );

  const { buffer, refreshCount, aborted, controller } = state;

  /**
   * Abort abandoned streams.
   */
  useEffect(
    () => {
      if (aborted) {
        controller?.abort();
      }
    },
    [aborted, controller]
  );

  /**
   * Reset the token buffer when it is refreshed.
   */
  useEffect(
    () => {
      dispatch({ type: "reset" });
    },
    [refreshCount]
  );

  /**
   * Fetch the new token stream.
   */
  useEffect(
    () => {
      const newController = new AbortController();
      dispatch({ type: "setController", payload: newController });

      (async () => {
        try {
          const response = await fetch(url, { signal: newController.signal });
          if (!response.body) {
            throw new Error(`Failed to load response from URL: ${url}`);
          }

          const stream = yieldStream(response.body, newController);
          for await (const chunk of stream) {
            const text = DECODER.decode(chunk);
            dispatch({
              type: "add",
              payload: text,
            });
          }
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            // The stream was cancelled.
          } else {
            throw error;
          }
        }
      })();

      return () => {
        newController.abort();
      };
    },
    [aborted, refreshCount, url]
  );

  return {
    buffer,
    refresh: () => dispatch({ type: "refresh" }),
    cancel: () => dispatch({ type: "cancel" }),
  };
};
