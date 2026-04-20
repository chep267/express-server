/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** libs */
import fs from 'node:fs';
import path from 'node:path';

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
    console.log(`✅ Đã tạo module: ${moduleName}`);

    // Tạo các thư mục con
    folders.forEach((folder) => {
        const folderPath = path.join(basePath, folder);
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`✅ Đã tạo thư mục: ${folderPath}`);
    });

    // Tạo file README.md trong thư mục module
    // const readmePath = path.join(basePath, 'README.md');
    // fs.writeFileSync(readmePath, `# ${moduleName}\n\nMô tả module ${moduleName}`);
    // console.log(`✅ Đã tạo file: ${readmePath}`);
};

// Xử lý tham số dòng lệnh để lấy tên module
const moduleName = process.argv[2];
createModuleStructure(moduleName);
