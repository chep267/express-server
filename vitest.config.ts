/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** libs */
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
        alias: {
            '@src': './src',
            '@test': './test'
        }
    },
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            reporter: ['text', 'html'],
            reportsDirectory: './coverage'
        }
    }
});
