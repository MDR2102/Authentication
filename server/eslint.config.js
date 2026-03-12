import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import security from "eslint-plugin-security";
import promise from "eslint-plugin-promise";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,

  {
    files: ["**/*.{ts,js}"],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        process: "readonly",
        __dirname: "readonly",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      "unused-imports": unusedImports,
      security,
      promise,
      prettier,
    },

    rules: {
      /*
      =============================
      PRETTIER
      =============================
      */
      "prettier/prettier": "error",

      /*
      =============================
      TYPESCRIPT
      =============================
      */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": "off",

      /*
      =============================
      UNUSED IMPORTS
      =============================
      */
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
      IMPORT ORDER
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
      SECURITY
      =============================
      */
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-unsafe-regex": "warn",

      /*
      =============================
      PROMISE / ASYNC
      =============================
      */
      "promise/always-return": "off",
      "promise/no-return-wrap": "error",
      "promise/catch-or-return": "error",

      /*
      =============================
      GENERAL RULES
      =============================
      */
      eqeqeq: ["error", "always"],
      quotes: ["error", "double"],
      semi: ["error", "always"],

      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],

      "no-debugger": "error",

      "eol-last": "error",

      /*
      =============================
      NODE BEST PRACTICES
      =============================
      */
      "no-process-exit": "warn",
      "no-return-await": "error",
    },
  },
];
