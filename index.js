const declIsColorVar = require("./src/declIsColorVar.js");
const extractColorValues = require("./src/extractColorValues.js");

module.exports = () => {
  return {
    postcssPlugin: "postcss-split-color-vars",
    AtRule: {
      "split-colors": (rule, { Declaration }) => {
        rule.walkDecls(decl => {
          if (!declIsColorVar(decl)) {
            // copy over if not applicable
            const copiedDecl = new Declaration({
              prop: decl.prop,
              value: decl.value
            });
            rule.before(copiedDecl);
            return;
          }

          const [fnName, colorVals] = extractColorValues(decl);
          if (!colorVals) return; // skip if unrecognized
          const processedValues = new Array();
          let usesAlpha = false;

          // create destructed properties
          for (const [key, value] of colorVals) {
            const prop = decl.prop + "-" + key;
            const newDecl = new Declaration({ prop, value });
            const clone = rule.before(newDecl);
            processedValues.push(`var(${prop})`);
            if (key === "A") usesAlpha = true;
          }

          // create unstrucured property with original name
          let originalFn = fnName;
          if (usesAlpha && (originalFn === "rgb" || originalFn === "hsl")) {
            originalFn += "a";
          }
          const originalDecl = new Declaration({
            prop: decl.prop,
            value: `${originalFn}(${processedValues.join(", ")})`
          });
          rule.before(originalDecl);
        });

        rule.remove();
      }
    }
  };
};

module.exports.postcss = true;
