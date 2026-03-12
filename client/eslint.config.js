import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import i18next from "eslint-plugin-i18next";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  js.configs.recommended,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        window: "readonly",
        document: "readonly",
      },

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
      import: importPlugin,
      prettier,
      i18next,
      "@typescript-eslint": tsPlugin,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      /*
      =============================
      Prettier
      =============================
      */
      "prettier/prettier": "error",

      /*
      =============================
      Quotes
      =============================
      */
      quotes: ["error", "double"],
      "jsx-quotes": ["error", "prefer-double"],

      /*
      =============================
      Imports
      =============================
      */
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
        },
      ],

      /*
      =============================
      Unused Imports
      =============================
      */
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      /*
      =============================
      TypeScript
      =============================
      */
      "@typescript-eslint/no-explicit-any": "error",

      /*
      =============================
      React
      =============================
      */
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-pascal-case": "error",
      "react/jsx-no-useless-fragment": "error",

      /*
      =============================
      React Hooks
      =============================
      */
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /*
      =============================
      Performance
      =============================
      */
      "react/jsx-no-bind": [
        "warn",
        {
          allowArrowFunctions: true,
        },
      ],

      /*
      =============================
      i18n
      =============================
      */
      "i18next/no-literal-string": [
        "warn",
        {
          markupOnly: true,
        },
      ],

      /*
      =============================
      Console + Debug
      =============================
      */
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",

      /*
      =============================
      General
      =============================
      */
      eqeqeq: ["error", "smart"],
      "eol-last": "error",
    },
  },
];
