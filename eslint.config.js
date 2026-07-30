/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig(
    {
        ignores: ['dist/**/*', 'node_modules/**/*', 'public/**/*', '.vercel/**/*']
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx,vue}'],
        extends: [eslint.configs.recommended, ...tslint.configs.recommended],
        languageOptions: {
            ecmaVersion: 'latest',
            parser: tslint.parser,
            globals: globals.node
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn'
        }
    },
    prettierConfig
);
