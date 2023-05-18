import { colord, extend, getFormat } from "colord";
import hwbPlugin from "colord/plugins/hwb";
import labPlugin from "colord/plugins/lab";
import lchPlugin from "colord/plugins/lch";
import type { Declaration } from "postcss";

extend([hwbPlugin]);
extend([labPlugin]);
extend([lchPlugin]);

export function parseColour(decl: Declaration, prompt: string) {
  const value = decl.value.slice(0, decl.value.indexOf(prompt)).trim();
  let colour = colord(value);

  if (!colour.isValid()) {
    let match: RegExpMatchArray | null;
    if (
      (match = value.match(
        /lab\(([0-9.]+)% ([0-9.]+) ([0-9.]+)(?: \/ ([0-9.]+))?\)/
      ))
    ) {
      const [, l, a, b, alpha] = match;
      colour = colord({
        l: +l,
        a: +a,
        b: +b,
        alpha: typeof alpha == "string" ? +alpha : undefined
      });

      if (colour.isValid()) {
        return { value, colour, nativeFormat: "lab" };
      }
    }

    throw decl.error(`Could not parse color value: '${value}'`, {
      plugin: "postcss-split-colors"
    });
  }

  const nativeFormat = getFormat(value)!;
  return { value, colour, nativeFormat };
}
