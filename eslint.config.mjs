import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import { globalIgnores } from 'eslint/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
})

const eslintConfig = [
	globalIgnores(['src/generated/', '**/dist/']),
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
			'@typescript-eslint/no-explicit-any': 'warn',
		},
	},
]

export default eslintConfig
