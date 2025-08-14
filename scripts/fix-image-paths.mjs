import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 修复图片路径的函数
function fixImagePaths(content) {
    // 修复重复的assets路径
    content = content.replace(/\/assets\/assets\/assets\//g, '/assets/');
    return content;
}

// 递归查找所有HTML文件
function findHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            findHtmlFiles(fullPath, files);
        } else if (item.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// 主函数
function main() {
    const rootDir = path.join(__dirname, '..');
    const htmlFiles = findHtmlFiles(rootDir);
    
    console.log(`找到 ${htmlFiles.length} 个HTML文件需要修复`);
    
    let fixedCount = 0;
    
    for (const filePath of htmlFiles) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;
            const fixedContent = fixImagePaths(content);
            
            if (originalContent !== fixedContent) {
                fs.writeFileSync(filePath, fixedContent, 'utf8');
                console.log(`✅ 修复: ${path.relative(rootDir, filePath)}`);
                fixedCount++;
            } else {
                console.log(`⏭️  无需修复: ${path.relative(rootDir, filePath)}`);
            }
        } catch (error) {
            console.error(`❌ 错误处理文件 ${filePath}:`, error.message);
        }
    }
    
    console.log(`\n完成！修复了 ${fixedCount} 个文件`);
}

main(); 