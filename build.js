import fs from 'fs';
import path from 'path';

const addJsExtension = (dir) => {
    // Đọc tất cả các file và thư mục trong thư mục 'dir'
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        // Nếu là thư mục con, đệ quy vào thư mục đó
        if (fs.statSync(filePath).isDirectory()) {
            addJsExtension(filePath); // Đệ quy nếu là thư mục
        } else if (file.endsWith('.js')) {
            // Nếu là file JavaScript, thay thế các import để thêm .js vào
            let content = fs.readFileSync(filePath, 'utf8');
            content = content.replace(/(from\s+['"])(\.\.\/|\.\.\/.*?\/|\.\/)([^'"]+)(['"])/g, '$1$2$3.js$4');
            fs.writeFileSync(filePath, content, 'utf8');
        }
    });
};

addJsExtension('./output'); // Xử lý thư mục dist
