import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚨 OG图片问题检测到！');
console.log('');
console.log('问题：assets/og-image.jpg 只是一个占位符文件，不是真正的图片');
console.log('');
console.log('解决方案：');
console.log('1. 创建一个真正的1200x630像素的JPEG图片');
console.log('2. 替换 assets/og-image.jpg 文件');
console.log('3. 确保图片大小小于1MB');
console.log('');
console.log('推荐内容：');
console.log('- Dungeon Raid游戏截图或logo');
console.log('- 使用品牌色彩：霓虹蓝(#00D4FF)、紫色(#8B5CF6)、粉色(#F72C85)');
console.log('- 包含游戏标题和视觉元素');
console.log('');
console.log('临时解决方案：');
console.log('- 使用现有的游戏截图，如 dungeon-raid2.jpg');
console.log('- 或者暂时移除OG图片meta标签');

// 检查是否有可用的图片文件
const assetsDir = path.join(__dirname, '..', 'assets');
const imageFiles = fs.readdirSync(assetsDir).filter(file => 
    file.match(/\.(jpg|jpeg|png|gif|webp)$/i) && file !== 'og-image.jpg'
);

if (imageFiles.length > 0) {
    console.log('可用的图片文件：');
    imageFiles.forEach(file => {
        const stats = fs.statSync(path.join(assetsDir, file));
        const sizeKB = Math.round(stats.size / 1024);
        console.log(`- ${file} (${sizeKB}KB)`);
    });
    
    console.log('');
    console.log('建议：使用 dungeon-raid2.jpg 作为临时OG图片');
} 