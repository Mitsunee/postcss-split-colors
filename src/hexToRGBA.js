function hexToRGBA(value, error) {
  if (!/^#[0-9a-f]{3,8}$/i.test(value)) {
    throw error("Invalid hex color");
  }

  const len = value.length - 1;
  let r, g, b, a;

  switch (len) {
    case 4:
      a = value.substring(4, 5).repeat(2);
    // break omitted
    case 3:
      r = value.substring(1, 2).repeat(2);
      g = value.substring(2, 3).repeat(2);
      b = value.substring(3, 4).repeat(2);
      break;
    case 8:
      a = value.substring(7, 9);
    // break omitted
    case 6:
      r = value.substring(1, 3);
      g = value.substring(3, 5);
      b = value.substring(5, 7);
      break;
    default:
      throw error("Could not parse hex color");
  }

  r = +`0x${r}`;
  g = +`0x${g}`;
  b = +`0x${b}`;
  a = a
    ? "," + Number((+`0x${a || "FF"}` / 255).toPrecision(5)) * 100 + "%"
    : "";

  return `rgb${a ? "a" : ""}(${r},${g},${b}${a})`;
}

module.exports = hexToRGBA;
