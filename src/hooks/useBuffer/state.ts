export type State = {
  done: boolean;
  buffer: Uint8Array[];
  refreshCount: number;
  aborted: boolean;
  controller: AbortController | null;
};

export type Action =
  | { type: "cancel" }
  | { type: "refresh" }
  | { type: "add"; payload: Uint8Array }
  | { type: "setController"; payload: AbortController };

export const streamState = (prevState: State, action: Action) => {
  switch (action.type) {
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

    case "setController":
      return {
        ...prevState,
        controller: action.payload,
      };

    default:
      return prevState;
  }
};