import { parseComponentValue } from "@csstools/css-parser-algorithms";
import { tokenize } from "@csstools/css-tokenizer";
import { ColorNotation, color } from "@csstools/css-color-parser";
import { colord, extend } from "colord";
import type { Colord } from "colord";
import hwbPlugin from "colord/plugins/hwb";
import labPlugin from "colord/plugins/lab";
import lchPlugin from "colord/plugins/lch";
import type { Declaration } from "postcss";

extend([hwbPlugin]);
extend([labPlugin]);
extend([lchPlugin]);

export type SupportedFormats =
  | ColorNotation.RGB
  | ColorNotation.HSL
  | ColorNotation.HWB
  | ColorNotation.LCH
  | ColorNotation.Lab;

type NativeChannels = [number, number, number];

export interface ParsedColour {
  colour: Colord;
  nativeFormat: SupportedFormats;
  nativeChannels: NativeChannels;
  nativeAlpha?: number;
}

export function parseColour(decl: Declaration, value: string): ParsedColour {
  let colour: Colord;
  let nativeFormat: SupportedFormats;
  const colourComponent = parseComponentValue(tokenize({ css: value }));
  if (!colourComponent) {
    throw decl.error(`Could not parse color value '${value}'`, {
      plugin: "postcss-split-colors"
    });
  }

  const colourData = color(colourComponent);
  if (!colourData) {
    throw decl.error(`Could not parse color value '${value}'`, {
      plugin: "postcss-split-colors"
    });
  }

  const nativeChannels = colourData.channels;
  switch (colourData.colorNotation) {
    case ColorNotation.HEX:
    case ColorNotation.RGB: {
      const [r, g, b] = nativeChannels;
      colour = colord({ r, g, b });
      nativeFormat = ColorNotation.RGB;
      break;
    }

    case ColorNotation.HSL: {
      const [h, s, l] = nativeChannels;
      colour = colord({ h, s, l });
      nativeFormat = ColorNotation.HSL;
      break;
    }

    case ColorNotation.Lab: {
      const [l, a, b] = nativeChannels;
      colour = colord({ l, a, b });
      nativeFormat = ColorNotation.Lab;
      break;
    }

    case ColorNotation.LCH: {
      const [l, c, h] = nativeChannels;
      colour = colord({ l, c, h });
      nativeFormat = ColorNotation.LCH;
      break;
    }

    case ColorNotation.HWB: {
      const [h, w, b] = nativeChannels;
      colour = colord({ h, w, b });
      nativeFormat = ColorNotation.HWB;
      break;
    }

    default:
      throw decl.error(
        `Unsupported color notation '${colourData.colorNotation}' in value '${value}'`
      );
  }

  const nativeAlpha =
    typeof colourData.alpha == "number" ? colourData.alpha : undefined;
  return { colour, nativeChannels, nativeFormat, nativeAlpha };
}
