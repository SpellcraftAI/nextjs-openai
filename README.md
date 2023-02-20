# OpenAI for Next.js

[**Github**](https://github.com/gptlabs/nextjs-openai) |
[**NPM**](https://npmjs.com/package/nextjs-openai) |
[**Demo**](https://nextjs-openai.vercel.app) |
[**Docs**](https://nextjs-openai.vercel.app/docs)

Adds hooks and components for working with OpenAI streams.

<img width="600" src="https://github.com/gptlabs/nextjs-openai/raw/master/public/nextjs-openai-demo.gif">

### Requirements

Only available in **Edge runtime** (or **Node 18+**) due to reliance on WHATWG
`ReadableStream`. See [**Edge Runtime**](#edge-runtime) below for an example.

### Installation

```bash
yarn add nextjs-openai

# -or-

npm i --save nextjs-openai
```

### Hooks

`useBuffer()` and `useTextBuffer()` are used to load an incrementing buffer of
data (and text) from a given URL.

```tsx
import { useTextBuffer } from "nextjs-openai";

export default function Demo() {
  const { buffer, refresh, cancel, done } = useTextBuffer(url, 200);
  
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
    <StreamingTextURL url="/api/demo" fade={600} throttle={100} />
  );
}
```

### Edge Runtime

This library re-exports
[`openai-streams`](https://github.com/gptlabs/openai-streams) for convenience.
Use it like so:

```ts
// src/pages/api/demo.ts
import { OpenAI } from "nextjs-openai/streams";

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