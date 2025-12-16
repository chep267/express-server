import * as esbuild from 'esbuild';

esbuild
    .build({
        entryPoints: ['dist/index.js'],
        bundle: true,
        platform: 'node',
        external: ['node:events', 'fs', 'path', 'os', 'http', 'https', 'express', 'morgan', 'cookie-parser'],
        outfile: 'dist/app.cjs'
    })
    .catch(() => process.exit(1));
