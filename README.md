# postcss-split-color-vars

[PostCSS] plugin to destructure colors in custom properties.

Use the AtRule `@split-colors` in the selector you want to define the custom properties in.

[postcss]: https://github.com/postcss/postcss

```css
:root {
  @split-colors {
    --color-primary: rgb(14, 14, 14);
    --color-foo: rgb(128 0 0 / 80%);
  }
}
```

```css
:root {
  --color-primary-r: 14;
  --color-primary-g: 14;
  --color-primary-b: 14;
  --color-primary: rgb(var(--color-primary-r), var(--color-primary-g), var(--color-primary-b));
  --color-foo-r: 128;
  --color-foo-g: 0;
  --color-foo-b: 0;
  --color-foo-A: 80%;
  --color-foo: rgba(var(--color-foo-r), var(--color-foo-g), var(--color-foo-b), var(--color-foo-A));
}
```

Currently the color functions `rgb()`, `rgba()`, `hsl()`, `hsla()`, `lch()`, `lab()`, `hwb` and hex color (with 3, 4, 6 or 8 digits) are supported. Color functions are supported with both comma-separated syntax (like `rgba(14, 14, 14, 1)`) and space-separated syntax (like `hsla(120% 100% 50% / 60%)`) with optional alpha channel. `rgb()` and `hsl()` will be transformed to `rgba()` or `hsla()` respectively if alpha transparency is used.

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-split-color-vars
```

**Step 2:** Check your project for existing PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-split-color-vars'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
