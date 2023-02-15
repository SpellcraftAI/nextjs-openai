# OpenAI for Next.js

**Demo: https://nextjs-openai.vercel.app**

Adds hooks and components for working with OpenAI streams.

### Hooks

`useBuffer()` and `useTextBuffer()` are used to load an incrementing buffer of
data (and text) from a given URL.

### Components

`<StreamingText>` and `<StreamingTextURL>` render text from a stream buffer
using a fade-in animation.