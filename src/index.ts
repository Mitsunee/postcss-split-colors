import { parseColour } from "./parseColour";
import type { PluginCreator } from "postcss";
import { Declaration } from "postcss";
import { containsPrompt } from "./containsPrompt";
import { colordProxy } from "./colordProxy";

interface ConvertOption {
  rgb?: boolean;
  hsl?: boolean;
  hwb?: boolean;
  lab?: boolean;
  lch?: boolean;
}

export interface Options {
  prompt?: string;
  convert?: ConvertOption;
  preserveAlpha?: boolean;
  preserve?: boolean;
}

const plugin: PluginCreator<Options> = function (opts) {
  const prompt = `!${opts?.prompt || "split"}`;
  const convert = opts?.convert || {};
  const preserveAlpha = opts?.preserveAlpha ?? true;
  const preserveDecl = opts?.preserve ?? false;

  return {
    postcssPlugin: "postcss-split-colors",
    Declaration: decl => {
      if (!decl.variable) return;
      const value = containsPrompt(decl, prompt);
      if (!value) return;
      const parsedColour = parseColour(decl, value);
      const colour = colordProxy(parsedColour);
      const { nativeFormat, nativeAlpha } = parsedColour;

      if (nativeFormat == "rgb" || convert.rgb) {
        const rgba = colour.toRgb();
        const rgbDecl = new Declaration({
          prop: `${decl.prop}-rgb`,
          value: `${rgba.r} ${rgba.g} ${rgba.b}`
        });
        decl.before(rgbDecl);
      }

      if (nativeFormat == "hsl" || convert.hsl) {
        const hsl = colour.toHsl();
        const hslDecl = new Declaration({
          prop: `${decl.prop}-hsl`,
          value: `${hsl.h}deg ${hsl.s}% ${hsl.l}%`
        });
        decl.before(hslDecl);
      }

      if (nativeFormat == "lab" || convert.lab) {
        const lab = colour.toLab();
        const labDecl = new Declaration({
          prop: `${decl.prop}-lab`,
          value: `${lab.l}% ${lab.a} ${lab.b}`
        });
        decl.before(labDecl);
      }

      if (nativeFormat == "lch" || convert.lch) {
        const lch = colour.toLch();
        const lchDecl = new Declaration({
          prop: `${decl.prop}-lch`,
          value: `${lch.l}% ${lch.c} ${lch.h}`
        });
        decl.before(lchDecl);
      }

      if (nativeFormat == "hwb" || convert.hwb) {
        const hwb = colour.toHwb();
        const hwbDecl = new Declaration({
          prop: `${decl.prop}-hwb`,
          value: `${hwb.h}deg ${hwb.w}% ${hwb.b}%`
        });
        decl.before(hwbDecl);
      }

      if (!["hex", "rgb", "hsl", "lab", "lch", "hwb"].includes(nativeFormat)) {
        throw decl.error(`Format ${nativeFormat} is not supported`, {
          plugin: "postcss-split-colors"
        });
      }

      if (preserveDecl) {
        decl.value = value;
      } else {
        const hasAlpha =
          preserveAlpha && typeof nativeAlpha == "number" && nativeAlpha < 1;
        decl.value = `${nativeFormat}(var(${decl.prop}-${nativeFormat}${
          hasAlpha ? ` / ${nativeAlpha * 100}%` : ""
        }))`;
      }
    }
  };
};

plugin.postcss = true;

export default plugin;
