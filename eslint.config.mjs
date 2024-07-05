import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import promisePlugin from 'eslint-plugin-promise'
import reactPlugin from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
	...tseslint.config(
		{
			ignores: ['**/node_modules/*', '**/dist/'] // global ignore with single ignore key
		},
		// all projects:
		eslint.configs.recommended,
		...tseslint.configs.recommended,
		{
			plugins: {
				'promise': promisePlugin,
				'@stylistic': stylistic,
				'react': reactPlugin
			},
			languageOptions: {
				ecmaVersion: 2023,
				globals: {
					...globals.browser,
					...globals.node,
					...globals.es2023
				}
			},
			rules: {
				...promisePlugin.configs.recommended.rules,
				...stylistic.configs['recommended-flat'].rules,
				...reactPlugin.configs.recommended.rules,
				...reactPlugin.configs['jsx-runtime'].rules,

				// custom rules here
				'@typescript-eslint/no-var-requires': 'off',

				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-unused-vars': ['error', {
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}],
				'@stylistic/indent-binary-ops': ['error', 'tab'],
				'@stylistic/no-tabs': ['error', { allowIndentationTabs: true }],
				'@stylistic/indent': ['error', 'tab'],
				'@stylistic/jsx-indent': ['error', 'tab'],
				'@stylistic/jsx-indent-props': ['error', 'tab'],
				'@stylistic/comma-dangle': ['error', 'never'],

				'@stylistic/max-statements-per-line': 'off'
			},

			settings: {
				react: {
					version: 'detect' // You can add this if you get a warning about the React version when you lint
				}
			}
		}
	)

]
