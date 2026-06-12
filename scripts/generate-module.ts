/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** libs */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

// Hàm chính để tạo module
const createModuleStructure = (moduleName = 'module-test') => {
    if (!moduleName || typeof moduleName !== 'string') {
        console.error('❌ Vui lòng nhập tên module hợp lệ.');
        return;
    }

    // Đường dẫn gốc để tạo module (trong src/modules)
    const basePath = path.join(process.cwd(), 'src', 'modules', moduleName);

    // Danh sách các thư mục sẽ được tạo
    const folders = ['constants', 'controllers', 'models', 'routers', 'utils', 'types'];

    // Kiểm tra nếu thư mục gốc đã tồn tại
    if (fs.existsSync(basePath)) {
        console.error(`❌ Module "${moduleName}" đã tồn tại!`);
        return;
    }

    // Tạo thư mục gốc của module
    fs.mkdirSync(basePath, { recursive: true });
    folders.forEach((folder) => {
        const folderPath = path.join(basePath, folder);
        fs.mkdirSync(folderPath, { recursive: true });
    });
    const readmePath = path.join(basePath, 'README.md');
    fs.writeFileSync(readmePath, `# ${moduleName}\n\nMô tả module ${moduleName}`);
    console.log(`✅ Đã tạo xong cấu trúc module: ${moduleName}`);

    // 2. Tự động cập nhật tsconfig.json
    updateTsConfig(moduleName);
};

const updateTsConfig = (moduleName: string) => {
    const filenames = ['tsconfig.app.json', 'tsconfig.json'];
    let filename, tsconfigPath;

    for (const name of filenames) {
        const fullPath = path.join(process.cwd(), name);
        if (fs.existsSync(fullPath)) {
            filename = name;
            tsconfigPath = fullPath;
            break;
        }
    }
    if (!tsconfigPath) {
        throw new Error(`❌ Không tìm thấy file cấu hình nào trong danh sách: ${filenames.join(', ')}`);
    }

    try {
        // Đọc file
        const fileContent = fs.readFileSync(tsconfigPath, 'utf-8');
        // Parse JSON (Lưu ý: tsconfig chuẩn có thể có comment, nhưng JSON.parse chỉ nhận JSON thuần)
        const tsconfig = JSON.parse(fileContent);

        // Khởi tạo object paths nếu chưa có
        if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
        if (!tsconfig.compilerOptions.paths) tsconfig.compilerOptions.paths = {};

        const pathAlias = `@${moduleName}/*`;
        const pathTarget = [`./src/modules/${moduleName}/*`];

        // Kiểm tra xem đã tồn tại path này chưa
        if (tsconfig.compilerOptions.paths[pathAlias]) {
            console.log(`ℹ️ Path alias "${pathAlias}" đã tồn tại trong ${filename}.`);
            return;
        }

        // Thêm path mới
        tsconfig.compilerOptions.paths[pathAlias] = pathTarget;
        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 4), 'utf-8');
        try {
            execSync(`prettier --write ./${filename}`, { stdio: 'inherit' });
        } catch {
            // Do nothing
        }
        console.log(`✅ Đã thêm alias "${moduleName}" vào ${filename}`);
    } catch {
        console.error(`❌ Lỗi khi cập nhật ${filename}`);
    }
};

// Xử lý tham số dòng lệnh để lấy tên module
const moduleName = process.argv[2];
createModuleStructure(moduleName);
