const { test } = require("uvu");
const { ok, not } = require("uvu/assert");
const declIsColorVar = require("../src/declIsColorVar");

test("prop detection", () => {
  not(declIsColorVar({ prop: "color", value: "#000" }));
  ok(declIsColorVar({ prop: "--prop", value: "#000" }));
});

test("recognize hex colors", () => {
  ok(declIsColorVar({ prop: "--prop", value: "#0f0" }), "3 digits");
  ok(declIsColorVar({ prop: "--prop", value: "#0f0A" }), "4 digits");
  ok(declIsColorVar({ prop: "--prop", value: "#03f300" }), "6 digits");
  ok(declIsColorVar({ prop: "--prop", value: "#f3d3c3A5" }), "8 digits");

  not(declIsColorVar({ prop: "--prop", value: "#c" }), "1 digit");
  not(declIsColorVar({ prop: "--prop", value: "#f5" }), "2 digits");
  not(declIsColorVar({ prop: "--prop", value: "#f3ca9" }), "5 digits");
  not(declIsColorVar({ prop: "--prop", value: "#f3dc3A5" }), "7 digits");
});

test("recognize color functions", () => {
  ok(declIsColorVar({ prop: "--prop", value: "rgb(14, 14, 14)" }));
  ok(declIsColorVar({ prop: "--prop", value: "rgba(0, 0, 0, 0.5)" }));
  ok(declIsColorVar({ prop: "--prop", value: "hsl(235 100% 50%)" }));
  ok(declIsColorVar({ prop: "--prop", value: "hsl(235 100% 50% / 50%)" }));
  ok(declIsColorVar({ prop: "--prop", value: "lch(52.2345% 72.2 56.2 / .5)" }));
  ok(
    declIsColorVar({ prop: "--prop", value: "lab(52.2345% 40.1645 59.9971)" })
  );
  ok(declIsColorVar({ prop: "--prop", value: "hwb(194 0% 0%)" }));

  not(
    declIsColorVar({ prop: "--prop", value: "url(/icon.svg)" }),
    "reject other functions"
  );
});

test.run();
