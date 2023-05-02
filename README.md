# OpenAI for Next.js

[**Github**](https://github.com/SpellcraftAI/nextjs-openai) |
[**NPM**](https://npmjs.com/package/nextjs-openai) |
[**Demo**](https://nextjs-openai.vercel.app) |
[**Docs**](https://nextjs-openai.vercel.app/docs)

Adds hooks and components for working with OpenAI streams.

<img width="600"
src="https://github.com/SpellcraftAI/nextjs-openai/raw/master/public/nextjs-openai-demo.gif">

### Installation

`nextjs-openai` includes frontend tools, and `openai-streams` includes tools for
working with OpenAI streams in your API Routes.

```bash
yarn add nextjs-openai openai-streams

# -or-

npm i --save nextjs-openai openai-streams
```

### Hooks

`useBuffer()` and `useTextBuffer()` are used to load an incrementing buffer of
data (and text) from a given URL.

```tsx
import { useTextBuffer } from "nextjs-openai";

export default function Demo() {
  const { buffer, refresh, cancel, done } = useTextBuffer({ 
    url: "/api/demo"
  });
  
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

### Sending data and advanced usage

If you would like to change the type of network request made with
`<StreamingTextURL>` or the `useBuffer()` and `useTextBuffer()` hooks, you can
set the `{ method, data }` options.

`{ data }` is sent as the POST request body by default. To use a GET request,
set `{ method = "GET" }` and manually set the URL search params on `{ url }`.

<sub>See
[`src/pages/index.tsx`](https://github.com/SpellcraftAI/nextjs-openai/blob/master/src/pages/index.tsx)
for a live example.</sub>

#### With `<StreamingTextURL>`

```tsx
import { StreamingTextURL } from "nextjs-openai";

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
import { useTextBuffer, StreamingText } from "nextjs-openai";

export default function Home() {
  const [data, setData] = useState({ name: "John" });
  const { buffer, refresh, cancel } = useTextBuffer({
    url: "/api/demo",
    throttle: 100,
    data,
    /**
     * Optional: Override params for `fetch(url, params)`.
     */
    options: {
      headers: {
        // ...
      }
    }
  });
  // ...
  return (
    <StreamingText buffer={buffer}>
  );
}
```

### API Routes

Use `openai-streams` to work with streams in your API Routes.

#### Edge Runtime

```ts
import { OpenAI } from "openai-streams";

export default async function handler() {
  const stream = await OpenAI(
    "completions",
    {
      model: "text-davinci-003",
      prompt: "Write a happy sentence.\n\n",
      max_tokens: 25
    },
  );

  return new Response(stream);
}

export const config = {
  runtime: "edge"
};
```

#### Node <18

If you are not using Edge Runtime, import the `NodeJS.Readable` version from
`openai-streams/node`.

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai-streams/node";

export default async function test (_: NextApiRequest, res: NextApiResponse) {
  const stream = await OpenAI(
    "completions",
    {
      model: "text-davinci-003",
      prompt: "Write a happy sentence.\n\n",
      max_tokens: 25
    }
  );

  stream.pipe(res);
}
```
