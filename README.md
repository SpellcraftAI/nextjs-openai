# OpenAI for Next.js

[**Github**](https://github.com/gptlabs/nextjs-openai) |
[**NPM**](https://npmjs.com/package/nextjs-openai) |
[**Demo**](https://nextjs-openai.vercel.app) |
[**Docs**](https://nextjs-openai.vercel.app/docs)

Adds hooks and components for working with OpenAI streams.

<img width="600"
src="https://github.com/gptlabs/nextjs-openai/raw/master/public/nextjs-openai-demo.gif">

### Installation

`nextjs-openai` includes frontend tools, and `openai-streams` includes tools for
working with streams in Node 18+ and Edge runtime.

```bash
yarn add nextjs-openai openai-streams

# -or-

npm i --save nextjs-openai openai-streams
```

### Hooks

`useBuffer()` and `useTextBuffer()` are used to load an incrementing buffer of
data (and text) from a given URL.

```tsx
import { useTextBuffer } from "openai-streams";

export default function Demo() {
  const { buffer, refresh, cancel, done } = useTextBuffer({ url: "/api/demo" });
  
  return (
    <div>
      <StreamingText buffer={buffer} fade={600} />
      <button onClick={refresh} disabled={!done}>Refresh</button>
      <button onClick={cancel} disabled={done}>Cancel</button>
    </div>
  );
}
```

### Components

`<StreamingText>` and `<StreamingTextURL>` render text from a stream buffer
using a fade-in animation.

```tsx
import { StreamingTextURL } from "nextjs-openai";

export default function Demo() {
  return (
    <StreamingTextURL 
      url="/api/demo" 
      fade={600} 
      throttle={100} 
    />
  );
}
```

### Next.js Edge Runtime

Use `openai-streams` to consume streams from your API routes.

```ts
// src/pages/api/demo.ts
import { OpenAI } from "openai-streams";

export default async function demo() {
  const config = {
    model: "text-davinci-003",
    prompt: "Write a two-sentence paragraph.\n\n",
    temperature: 1,
    max_tokens: 100,
  };

  const completionsStream = await OpenAI("completions", config);
  return new Response(completionsStream);
}

export const config = {
  runtime: "edge",
};
```

This relies on the WHATWG `ReadableStream` being available (18+), so Edge
Runtime is required.



### Sending data and advanced usage

If you would like to change the type of network request made with
`<StreamingTextURL>` or the `useBuffer()` and `useTextBuffer()` hooks, you can
set the `{ method, data }` options.

`{ data }` is sent as the POST request body by default. To use a GET request,
set `{ method = "GET" }` and manually set the URL search params on `{ url }`.

<sub>See
[`src/pages/index.tsx`](https://github.com/gptlabs/nextjs-openai/blob/master/src/pages/index.tsx)
for a live example.</sub>

#### With `<StreamingTextURL>`

```tsx
export default function Home() {
  const [data, setData] = useState({ name: "John" });
  // ...
  return (
    <StreamingTextURL url="/api/demo" data={data}>
  );
}
```

#### With `useTextBuffer()`

```tsx
export default function Home() {
  const [data, setData] = useState({ name: "John" });
  const { buffer, refresh, cancel } = useTextBuffer({
    url: "/api/demo",
    throttle: 100,
    data,
  });
  // ...
  return (
    <StreamingText buffer={buffer}>
  );
}
```