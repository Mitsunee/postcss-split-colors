const postcssSplitColorVars = require("../dist/index.js");

module.exports = {
  plugins: [postcssSplitColorVars({ convert: { rgb: true } })]
};
