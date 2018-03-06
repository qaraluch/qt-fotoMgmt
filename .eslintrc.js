module.exports = {
  env: { es6: true, node: true },
  parser: "babel-eslint",
  rules: { strict: 0 },
  parserOptions: {
    ecmaVersion: 7,
    sourceType: "module",
    allowImportExportEverywhere: false
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    "no-console": "warn",
    "no-unused-vars": "warn",
    quotes: ["warn", "double"],
    semi: ["error", "always"]
  }
};
