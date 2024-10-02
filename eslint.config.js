/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import globals from 'globals';
import pluginJs from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tsEslint.configs.recommended,
    {
        plugins: {
            prettier: eslintPluginPrettier
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            'prettier/prettier': [
                'warn',
                {
                    arrowParens: 'always',
                    semi: true,
                    trailingComma: 'none',
                    tabWidth: 4,
                    endOfLine: 'auto',
                    useTabs: false,
                    singleQuote: true,
                    printWidth: 120,
                    jsxSingleQuote: true
                }
            ]
        },
        ignores: ['**/node_modules/', '**/dist/']
    }
];
