/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import * as esbuild from 'esbuild';

esbuild
    .build({
        entryPoints: ['dist/vercel.js'],
        bundle: true,
        platform: 'node',
        external: ['node:events', 'fs', 'path', 'os', 'http', 'https', 'express', 'morgan', 'cookie-parser'],
        outfile: 'dist/app.cjs'
    })
    .catch(() => process.exit(1));
