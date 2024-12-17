import { build } from 'esbuild';

build({
    entryPoints: ['./src/index.ts'], // File entry của ứng dụng
    bundle: true, // Gộp tất cả thành một file
    format: 'esm', // Xuất ra ES Modules
    platform: 'node', // Môi trường Node.js
    // target: 'esnext', // Target phiên bản Node.js
    target: 'es2022',
    outdir: 'dist', // Thư mục output
    // outfile: './dist/index.js',
    splitting: false, // Cho phép code splitting
    external: ['node_modules'] // Không bundle thư viện ngoài
})
    .then(() => {
        console.log('Build completed!');
    })
    .catch(() => process.exit(1));
