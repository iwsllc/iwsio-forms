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
		stylistic.configs.customize({
			braceStyle: '1tbs',
			commaDangle: 'never',
			indent: 'tab',
			jsx: true,
			quotes: 'single',
			semi: false
		}),
		{
			plugins: {
				promise: promisePlugin,
				react: reactPlugin
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
				...reactPlugin.configs.recommended.rules,
				...reactPlugin.configs['jsx-runtime'].rules,

				// custom rules here
				'promise/always-return': ['error', { ignoreLastCallback: true }],

				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-unused-vars': ['error', {
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}]
			},

			settings: {
				react: {
					version: 'detect' // You can add this if you get a warning about the React version when you lint
				}
			}
		},
		{
			files: ['**/*.test.ts', '**/*.test.tsx', '**/*.test.mts', '**/*.test.cts', '**/*.test.js'],
			plugins: {
				'@stylistic': stylistic
			},
			rules: {
				'@stylistic/max-statements-per-line': 'off'
			}
		}
	)

]
