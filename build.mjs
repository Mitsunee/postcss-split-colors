import { rm, cp } from "fs/promises";
import * as esbuild from "esbuild";

async function build() {
  return esbuild.build({
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
}

async function main() {
  console.log("Cleaning dist directory");
  await rm("dist", { recursive: true, force: true });
  console.log("Building lib");
  await build();
  console.log("Copying README.md");
  await cp("./README.md", "dist/README.md", { force: true });
}

main();
