import * as esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  packages: "external",
  platform: "node",
  format: "cjs",
  footer: {
    // This is required because default exports are bad
    // @see https://github.com/evanw/esbuild/issues/1182#issuecomment-1011414271
    js: "module.exports = module.exports.default;"
  }
});
