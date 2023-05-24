import type { Declaration } from "postcss";

/**
 * Checks if prompt exists in value and extracts colour function
 * @param decl PostCSS Declaration
 * @param prompt prompt string
 * @returns false if no prompt was found, colour function as string if prompt was found
 */
export function containsPrompt(decl: Declaration, prompt: string) {
  if (!decl.value.includes(prompt)) return false;

  let match: RegExpMatchArray | null | undefined;
  if ((match = decl.value.match(/#[a-f0-9]{3,8}/i))) {
    return match[0];
  }

  if ((match = decl.value.match(/[a-z]+\(.*\)/i))) {
    return match[0];
  }

  throw decl.error(
    `Declaration contains prompt ${prompt} but no valid color value was found: ${decl.value}`,
    { plugin: "postcss-split-colors" }
  );
}
