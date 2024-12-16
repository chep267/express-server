/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import globals from 'globals';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import pluginPrettier from 'eslint-plugin-prettier';

export default tsEslint.config({
    ignores: ['output/*', 'node_modules/*'],
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx,vue}'],
    extends: [eslint.configs.recommended, ...tsEslint.configs.recommended],
    plugins: {
        prettier: pluginPrettier
    },
    languageOptions: {
        globals: globals.node,
        parserOptions: {
            parser: '@typescript-eslint/parser'
        }
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn'
    }
});
