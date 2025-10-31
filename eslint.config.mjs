// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default tseslint.config(
	{
		ignores: ['dist', 'node_modules'], // папки, которые не проверяются
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended, // подключаем prettier
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		rules: {
			// TypeScript
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',
			'@typescript-eslint/no-unsafe-call': 'off',

			// Отступы / форматирование
			indent: ['error', 'tab'], // отступы табами
			'no-tabs': 'off', // разрешаем табы
			'prettier/prettier': ['error'],

			// Чистый код
			'unused-imports/no-unused-imports': 'warn',
			'import/order': [
				'warn',
				{
					'newlines-between': 'always',
					groups: [
						'builtin',
						'external',
						'internal',
						['parent', 'sibling', 'index'],
					],
				},
			],
		},
	},
);
