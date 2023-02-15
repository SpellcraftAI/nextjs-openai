# OpenAI for Next.js

- **Demo: https://nextjs-openai.vercel.app**
- **Docs: https://nextjs-openai.vercel.app/docs**

Adds hooks and components for working with OpenAI streams.

### Hooks

`useBuffer()` and `useTextBuffer()` are used to load an incrementing buffer of
data (and text) from a given URL.

```tsx
const { buffer, refresh, cancel, done } = useTextBuffer(url, 200);
 
return (
  <div>
    <StreamingText buffer={buffer} fade={600} />
    <button onClick={refresh} disabled={!done}>Refresh</button>
    <button onClick={cancel} disabled={done}>Cancel</button>
  </div>
)
```

### Components

`<StreamingText>` and `<StreamingTextURL>` render text from a stream buffer
using a fade-in animation.

```tsx
return (
  <StreamingTextURL url="/api/demo" fade={600} throttle={100} />
);
```