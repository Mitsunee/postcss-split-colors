function declIsColorVar({ prop, value }) {
  return (
    prop.startsWith("--") &&
    /^((rgba?|hsla?|lch|lab|hwb)\(.*\)|#[0-9a-f]{3,4}$|#[0-9a-f]{6}$|#[0-9a-f]{8})/i.test(
      value
    )
  );
}

module.exports = declIsColorVar;
