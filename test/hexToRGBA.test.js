const { test } = require("uvu");
const { is, throws } = require("uvu/assert");
const hexToRGBA = require("../src/hexToRGBA.js");

class MockError extends Error {}
const error = msg => new MockError(msg);
const err = error => error instanceof MockError;

test("recognize opaque colors", () => {
  is(hexToRGBA("#A30", error), "rgb(170,51,0)");
  is(hexToRGBA("#AA3300", error), "rgb(170,51,0)");
});

test("recognize transparent colors", () => {
  is(hexToRGBA("#f80a", error), "rgba(255,136,0,66.667%)");
  is(hexToRGBA("#ff8800aa", error), "rgba(255,136,0,66.667%)");
});

test("reject bad color codes", () => {
  throws(() => hexToRGBA("#a", error), err, "1 digit");
  throws(() => hexToRGBA("#a7", error), err, "2 digits");
  throws(() => hexToRGBA("#a7ca6", error), err, "5 digits");
  throws(() => hexToRGBA("#a7ca6f3", error), err, "7 digits");
  throws(() => hexToRGBA("#a7ca6f3d9", error), err, "9 digits");
});

test.run();
