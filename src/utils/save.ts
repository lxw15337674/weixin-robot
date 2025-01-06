import * as fs from 'fs';
import * as path from 'path';


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
