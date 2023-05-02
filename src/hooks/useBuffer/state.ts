import { SerializedError } from "../types";

export type State = {
  done: boolean;
  buffer: Uint8Array[];
  refreshCount: number;
  error: SerializedError | null;
  aborted: boolean;
  controller: AbortController | null;
};

export type Action =
  | { type: "cancel" }
  | { type: "refresh" }
  | { type: "done" }
  | { type: "reset" }
  | { type: "add"; payload: Uint8Array }
  | { type: "setError"; payload: SerializedError | null }
  | { type: "setController"; payload: AbortController };

export const streamState = (prevState: State, action: Action) => {
  switch (action.type) {
    case "reset":
      return {
        ...prevState,
        buffer: [],
      };

    case "cancel":
      prevState.controller?.abort();
      return {
        ...prevState,
        aborted: true,
        controller: null,
      };

    case "refresh":
      prevState.controller?.abort();
      return {
        ...prevState,
        aborted: false,
        buffer: [],
        refreshCount: prevState.refreshCount + 1,
        controller: new AbortController(),
      };

    case "add":
      // console.log("Adding chunk to buffer", action.payload);
      return {
        ...prevState,
        buffer: prevState.buffer.concat(action.payload),
      };

    case "done":
      return {
        ...prevState,
        done: true,
      };

    case "setError":
      return {
        ...prevState,
        done: Boolean(action.payload),
        error: action.payload,
      };

    case "setController":
      return {
        ...prevState,
        controller: action.payload,
      };

    default:
      return prevState;
  }
};