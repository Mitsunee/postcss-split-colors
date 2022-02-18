const { test } = require("uvu");
const { equal, throws } = require("uvu/assert");
const extractColorValues = require("../src/extractColorValues.js");

class MockError extends Error {}
const error = msg => new MockError(msg);
const err = error => error instanceof MockError;

test("extraction with comma syntax (opaque)", () => {
  equal(extractColorValues({ value: "rgb(170, 80, 90)", error }), [
    "rgb",
    [
      ["r", "170"],
      ["g", "80"],
      ["b", "90"]
    ]
  ]);
});

test("extraction with comma syntax (transparent)", () => {
  equal(extractColorValues({ value: "rgba(170, 80, 90, 0.5)", error }), [
    "rgba",
    [
      ["r", "170"],
      ["g", "80"],
      ["b", "90"],
      ["A", "0.5"]
    ]
  ]);
});

test("extraction with space syntax (opaque)", () => {
  equal(extractColorValues({ value: "hsl(170deg 50% 63.5%)", error }), [
    "hsl",
    [
      ["h", "170deg"],
      ["s", "50%"],
      ["l", "63.5%"]
    ]
  ]);
});

test("extraction with space syntax (transparent)", () => {
  equal(extractColorValues({ value: "hsla(170deg 50% 63.5% / 33%)", error }), [
    "hsla",
    [
      ["h", "170deg"],
      ["s", "50%"],
      ["l", "63.5%"],
      ["A", "33%"]
    ]
  ]);
});

test("throws if can't match", () => {
  throws(
    () => extractColorValues({ value: "hsl(170deg 50deg 63%)", error }),
    err
  );
  throws(
    () =>
      extractColorValues({ value: "rgba(there's a cat in your code)", error }),
    err
  );
});

test.run();
