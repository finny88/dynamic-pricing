import { createRequire } from 'module'
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import stylistic from '@stylistic/eslint-plugin'
import boundaries from 'eslint-plugin-boundaries'
import { defineConfig, globalIgnores } from 'eslint/config'

const require = createRequire(import.meta.url)
const { layersLib } = require('@feature-sliced/eslint-config/utils')

const getFsdElements = () => [
	// @x cross-import files must be listed first to take precedence over layer elements
	{ type: 'entities_x', pattern: 'src/entities/*/@x/*', mode: 'file' },
	...layersLib.FS_LAYERS.map((layer) => ({
		type: layer,
		pattern: `src/${layer}/!(_*){,/*}`,
		mode: 'folder',
		capture: ['slices'],
	})),
	...layersLib.FS_LAYERS.map((layer) => ({
		type: `gm_${layer}`,
		pattern: `src/${layer}/_*`,
		mode: 'folder',
		capture: ['slices'],
	})),
]

const getFsdBoundaryRules = () => [
	...layersLib.getUpperLayers('shared').map((layer) => ({
		from: layer,
		allow: layersLib.getLowerLayers(layer),
	})),
	// @x notation: entities may import cross-import files, and @x files may re-export from their own entity
	{ from: 'entities', allow: 'entities_x' },
	{ from: 'entities_x', allow: 'entities' },
	{ from: 'shared', allow: 'shared' },
	{ from: 'app', allow: 'app' },
	...layersLib.FS_LAYERS.map((layer) => ({
		from: `gm_${layer}`,
		allow: [layer, ...layersLib.getLowerLayers(layer)],
	})),
]

export default defineConfig([
	// Ignore build output
	globalIgnores(['dist']),

	{
		files: ['**/*.{js,jsx,ts,tsx}'],

		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
			prettierConfig,
		],

		plugins: {
			react,
			'@stylistic': stylistic,
		},

		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: globals.browser
		},

		settings: {
			react: {
				version: 'detect'
			}
		},

		rules: {
			/* React */
			'react/display-name': 'warn',
			'react/react-in-jsx-scope': 'off',
			'react/jsx-curly-brace-presence': ['error', { props: 'always' }],
			'react/no-children-prop': 'warn',

			/* Typescript */
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
			],
			'@typescript-eslint/no-use-before-define': 'warn',
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{ fixStyle: 'separate-type-imports', disallowTypeAnnotations: false },
			],

			/* Code quality */
			'@stylistic/max-len': ['error', { code: 175, ignoreStrings: true }],
			camelcase: 'error',
			eqeqeq: 'error',
			'no-nested-ternary': 'error',
			'no-console': 'error',
			'no-shadow': ['error', { hoist: 'all' }],
			'max-lines': ['error', 300],
			'no-implicit-coercion': [
				'error',
				{ disallowTemplateShorthand: true, allow: ['!!', '+'] },
			],
			curly: 'error',
			complexity: 'warn',
			'func-style': ['error', 'expression', { allowArrowFunctions: true }],
			'max-depth': ['error', 4],
			'max-nested-callbacks': ['error', 5],
			'max-statements': ['error', 50, { ignoreTopLevelFunctions: true }],
			'no-lone-blocks': 'error',
			'@stylistic/no-mixed-operators': 'error',
			'no-unsafe-optional-chaining': [
				'error',
				{ disallowArithmeticOperators: true }
			],

			/* Formatting */
			'@stylistic/spaced-comment': ['error', 'always', { exceptions: ['-+'] }],
			'@stylistic/array-bracket-newline': ['warn', { multiline: true }],
			'@stylistic/array-bracket-spacing': ['error', 'never'],
			'@stylistic/arrow-spacing': ['error', { before: true, after: true }],
			'@stylistic/block-spacing': 'error',
			'@stylistic/jsx-quotes': ['error', 'prefer-double'],
			'@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/comma-dangle': ['off', 'always-multiline'],
			'@stylistic/function-paren-newline': ['error', { minItems: 3 }],
			'@stylistic/keyword-spacing': ['error', { before: true, after: true }],
			'@stylistic/linebreak-style': ['error', 'unix'],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/semi': ['error', 'never'],
			'@stylistic/object-curly-spacing': ['error', 'always'],
			'@stylistic/no-multi-spaces': 'error'
		}
	},

	// FSD layer boundary enforcement (@feature-sliced/eslint-config)
	{
		files: ['src/**/*.{ts,tsx}'],
		plugins: { boundaries },
		settings: {
			'boundaries/elements': getFsdElements(),
			'import/resolver': {
				typescript: {
					project: './tsconfig.app.json',
				},
			},
		},
		rules: {
			'boundaries/element-types': [
				'error', {
					default: 'disallow',
					message: '"${file.type}" is not allowed to import "${dependency.type}" | See: https://feature-sliced.design/docs/reference/layers',
					rules: getFsdBoundaryRules(),
				}
			],
		},
	},
])
