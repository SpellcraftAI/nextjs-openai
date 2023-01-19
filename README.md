# `tsmodule` component library

This is a [`tsmodule`](https://github.com/tsmodule/tsmodule) component library
developed and previewed with Next.js.

### Develop

To start the Next server and develop your components, use `next dev` or the
`yarn dev` script:

```bash
yarn dev
# calls `next dev`
```

### Export and publish

To export your component library, use `tsmodule build` or the `yarn export`
script:

```bash
yarn export
# calls `tsmodule build`
```

You can then publish to NPM:

```bash
yarn publish
```

#### Importing from your component library

To reuse your components:

  1. Import your component styles via `import "my-library/styles"`.
  2. Import your component and render it via `import { MyComponent } from
     "my-library/MyComponent`.

#### Footnotes

Styles are exported in `dist/`, and are also bundled to `dist/bundle.css` from
the entrypoint given in the `style` package.json.

The default behavior is to export all component styles, i.e.
`src/styles/components/index.css ➞ dist/bundle.css`.  This can be overridden
with tsmodule's `--styles` flag, i.e. `tsmodule build --styles
src/styles/index.css` (which would include all styles in emitted bundle).