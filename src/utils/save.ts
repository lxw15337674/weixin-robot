import * as fs from 'fs';
import * as path from 'path';
import { mdimg } from "mdimg";



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



export async function saveTextToImage(text: string, filename: string) {
    try {
        const { data } = await mdimg({
            inputText: text,
            encoding: 'base64',
            cssTemplate: 'empty',
            cssText: `
                .markdown-body {
                    line-height: 0.7;
                    padding:5px;
                }
            `,
            extensions: false
        });

        const buffer = Buffer.from(data.toString(), 'base64');
        return await saveBufferToImage(buffer, filename);
    } catch (error) {
        console.error('生成图片失败:', error);
        throw error;
    }
} 