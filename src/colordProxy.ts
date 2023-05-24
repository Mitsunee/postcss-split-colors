import type { RgbColor, RgbaColor } from "colord";
import type { HslColor, HslaColor } from "colord";
import type { HwbColor, HwbaColor } from "colord";
import type { LabColor, LabaColor } from "colord";
import type { LchColor, LchaColor } from "colord";
import type { ParsedColour } from "./parseColour";

export function colordProxy(parsed: ParsedColour) {
  const proxiedMethod =
    `to${parsed.nativeFormat[0].toUpperCase()}${parsed.nativeFormat
      .slice(1)
      .toLowerCase()}` as `to${Capitalize<ParsedColour["nativeFormat"]>}`;

  return new Proxy(parsed.colour, {
    get(target, prop) {
      if (prop === proxiedMethod) {
        const { nativeFormat: format, nativeChannels: channels } = parsed;

        switch (format) {
          case "rgb": {
            return () => {
              const val: RgbColor & Partial<RgbaColor> = {
                r: channels[0] * 255,
                g: channels[1] * 255,
                b: channels[2] * 255,
                a: parsed.nativeAlpha
              };
              return val;
            };
          }
          case "hsl": {
            return () => {
              const val: HslColor & Partial<HslaColor> = {
                h: channels[0],
                s: channels[1],
                l: channels[2],
                a: parsed.nativeAlpha
              };
              return val;
            };
          }
          case "hwb": {
            return () => {
              const val: HwbColor & Partial<HwbaColor> = {
                h: channels[0],
                w: channels[1],
                b: channels[2],
                a: parsed.nativeAlpha
              };
              return val;
            };
          }
          case "lab": {
            return () => {
              const val: LabColor & Partial<LabaColor> = {
                l: channels[0],
                a: channels[1],
                b: channels[2],
                alpha: parsed.nativeAlpha
              };
              return val;
            };
          }
          case "lch": {
            return () => {
              const val: LchColor & Partial<LchaColor> = {
                l: channels[0],
                c: channels[1],
                h: channels[2],
                a: parsed.nativeAlpha
              };
              return val;
            };
          }
        }
      }

      //@ts-ignore
      return Reflect.get(...arguments);
    }
  });
}
