module.exports = {
  extends: ["eslint:recommended", "foxkit", "foxkit/ts-strict", "prettier"],
  overrides: [
    {
      files: ["**/*.ts"],
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname
      },
      rules: {
        "@typescript-eslint/no-throw-literal": "off"
      }
    }
  ]
};
