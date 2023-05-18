# postcss-split-colors

[PostCSS] plugin to destructure colors in custom properties.

Use `!split` in the custom property color declaration you want to split.

[postcss]: https://github.com/postcss/postcss

```css
:root {
  --primary: rgb(14, 14, 14) !split;
  --red: hsl(0 80% 50% / 25%) !split;
  --foo: lch(48.25% 30.07 196.38) !split;
  --bar: hwb(210 0% 60% / 50%) !split;
  --baz: lab(52.2345% 40.1645 59.9971) !split;
}
```

```css
:root {
  --primary-rgb: 14 14 14;
  --primary: rgb(var(--primary-rgb));
  --red-hsl: 0 80 50;
  --red: hsl(var(--red-hsl / 0.25));
  --foo-lch: 48.25% 30.07 196.38;
  --foo: lch(var(--foo-lch));
  --bar-hwb: 210 0% 60%;
  --bar: hwb(var(--bar-hwb / 0.5));
  --baz-lab: 52.23% 40.16 52.23;
  --baz: lab(var(--baz-lab));
}
```

Currently the color functions `rgb()`, `hsl()`, `lch()`, `lab()`, `hwb()` and hex color (with 3, 4, 6 or 8 digits) are supported via [colord]. Alpha values are preserved by default (see options). Note that currently all values are converted to RGB internally, meaning there will be rounding errors. This will be fixed in a future release.

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-split-colors
```

**Step 2:** Check your project for an existing PostCSS config: `postcss.config.js`
in the project root.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
+ const splitColors = require("postcss-split-colors");

  module.exports = {
    plugins: [
+     splitColors(/* pluginOptions */),
      require("autoprefixer")
    ]
  }
```

## Options

### prompt

Modify the prompt text from `"split"` to any string. The preceeding `!` is added by the plugin:

```js
// postcss.config.js
const splitColors = require("postcss-split-colors");

module.exports = {
  plugins: [splitColors({ prompt: "foobar" })]
};
```

```css
/* your-file.css */
.selector {
  --color: #ff8800 !foobar;
}
```

### convert

Add additional color format conversions to every transformation:

```js
// postcss.config.js
const splitColors = require("postcss-split-colors");

module.exports = {
  plugins: [splitColors({ convert: { rgb: true } })]
};
```

Available keys: `rgb`, `hsl`, `lab`, `lch`, `hwb`. Hex colors are treated as RGB.

### preserve

Preserves the initial declaration, only removing the prompt. This is currently recommended if you find that you are getting rounding errors.

```js
// postcss.config.js
const splitColors = require("postcss-split-colors");

module.exports = {
  plugins: [splitColors({ preserve: true })]
};
```

### preserveAlpha

Preserves the alpha value of the initial declaration, injecting only the split-off color property. This is enabled by default, and can be disabled with `false` (which omits the value in the transformed declaration):

```js
// postcss.config.js
const splitColors = require("postcss-split-colors");

module.exports = {
  plugins: [splitColors({ preserveAlpha: false })]
};
```

[official docs]: https://github.com/postcss/postcss#usage
[colord]: https://github.com/omgovich/colord
