import * as fs from 'fs';
import * as path from 'path';
// import { createCanvas } from 'canvas';



export const saveBufferToImage = async (buffer: Buffer, filename:string) => {
    const dir = path.join(process.cwd(), 'images');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    // const filename = `${prefix}_${timestamp}.png`;
    const filepath = path.join(dir, filename);

    fs.writeFileSync(filepath, buffer);
    return filepath;
};


// mdimg 不支持vite-node执行
// export async function saveTextToImage(text: string, filename: string) {
//     try {
//         // 创建画布
//         const canvas = createCanvas(800, 400); // 可以根据需要调整尺寸
//         const ctx = canvas.getContext('2d');

//         // 设置背景
//         ctx.fillStyle = 'white';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         // 设置文本样式
//         ctx.font = '14px Arial';
//         ctx.fillStyle = 'black';

//         // 文本换行处理
//         const words = text.split(' ');
//         let line = '';
//         let y = 30;
//         const lineHeight = 20;
//         const maxWidth = 780;

//         for (let word of words) {
//             const testLine = line + word + ' ';
//             const metrics = ctx.measureText(testLine);
            
//             if (metrics.width > maxWidth) {
//                 ctx.fillText(line, 10, y);
//                 line = word + ' ';
//                 y += lineHeight;
//             } else {
//                 line = testLine;
//             }
//         }
//         ctx.fillText(line, 10, y);

//         // 转换为buffer
//         const buffer = canvas.toBuffer('image/png');
//         return await saveBufferToImage(buffer, filename);
//     } catch (error) {
//         console.error('生成图片失败:', error);
//         throw error;
//     }
// } 