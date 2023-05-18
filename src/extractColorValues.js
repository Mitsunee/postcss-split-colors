const hexToRGBA = require("./hexToRGBA.js");

function splitColorValues(values, valNames, error) {
  const split = new Object();
  let temp;

  // space-separated syntax
  if (
    /^[0-9.]+(%|turn|deg|rad)? [0-9.]+%? [0-9.]+%?( \/ [0-9.]+%?)?$/i.test(
      values
    )
  ) {
    temp = values.split(" ").filter(v => v !== "/");
  }

  // comma-separated syntax
  else if (
    /^[0-9.]+(%|turn|deg|rad)?,\s*[0-9.]+%?,\s*[0-9.]+%?(,\s*[0-9.]+%?)?$/i.test(
      values
    )
  ) {
    temp = values.split(",");
  }

  // throw if neither matched
  if (!temp) {
    throw error("Unrecognized color function syntax");
  }

  for (let i = 0; i < temp.length; i++) {
    const v = temp[i].trim();
    const key = valNames[i];
    if (key) split[key] = v;
  }

  return split;
}

function extractColorValues({ value, error }) {
  const reg = /^([a-z]+)\((.*)\)$/i;
  const match = value.startsWith("#")
    ? hexToRGBA(value, error).match(reg)
    : value.match(reg);
  if (!match) {
    throw error("Could not parse color function");
  }
  const [, fnName, values] = match;
  const valNames = [...fnName.toLowerCase().substring(0, 3).split(""), "A"];
  const valuesSplit = splitColorValues(values, valNames, error);

  return [fnName, Object.entries(valuesSplit)];
}

module.exports = extractColorValues;
