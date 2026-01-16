import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import sonarjs from "eslint-plugin-sonarjs";
import prettier from "eslint-config-prettier";

export default [
	{
		ignores: [
			"build/",
			"dist/",
			"lib/",
			"output/",
			"storybook-static/",
			"node_helper.js",
			"MMM-PrometheusAlerts.js",
			"**/ModuleTypes.d.ts"
		]
	},
	js.configs.recommended,
	{
		files: ["**/*.ts", "**/*.js"],
		plugins: {
			"@typescript-eslint": tseslint,
			sonarjs: sonarjs
		},
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				sourceType: "module",
				ecmaVersion: 2017,
				ecmaFeatures: {
					globalReturn: true
				}
			},
			globals: {
				// MagicMirror globals
				config: true,
				Log: true,
				MM: true,
				Module: true,
				moment: true,
				// Node.js globals
				console: true,
				process: true,
				__dirname: true,
				require: true,
				module: true,
				exports: true,
				Buffer: true,
				setTimeout: true,
				clearTimeout: true,
				setInterval: true,
				clearInterval: true,
				// Browser globals
				document: true,
				window: true,
				HTMLElement: true,
				// Jest globals
				describe: true,
				it: true,
				expect: true,
				jest: true,
				beforeEach: true,
				afterEach: true,
				beforeAll: true,
				afterAll: true,
				test: true
			}
		},
		rules: {
			...tseslint.configs.recommended.rules,
			...sonarjs.configs.recommended.rules
		}
	},
	prettier
];
