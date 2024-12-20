import axios from 'axios';
import path from 'path';
import fs from 'fs';

enum MapType {
    hy = 'hy',
    gu = 'gu'
}

async function getFutuStockMap(symbol: string, mapType: MapType) {
    const filePath = path.resolve(process.cwd(), `map/futu-${symbol}-${mapType}.png`);

    try {
        // 检查目录是否存在，不存在则创建
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // 通过API获取图片
        const response = await axios({
            method: 'GET',
            url: `https://nest-stock.zeabur.app/getFutuStockMap/${symbol}/${mapType}`,
            responseType: 'arraybuffer'
        });

        // 将图片数据写入文件
        fs.writeFileSync(filePath, response.data);
        console.log(`保存图片成功: ${filePath}`);
        return filePath;
    } catch (error) {
        console.error('获取股市热力图失败:', error);
        throw error;
    }
}

async function getYuntuStockMap() {
    const filePath = path.resolve(process.cwd(), `map/yuntu.png`);

    try {
        // 检查目录是否存在，不存在则创建
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // 通过API获取图片
        const response = await axios({
            method: 'GET',
            url: `https://nest-stock.zeabur.app/getYuntuStockMap`,
            responseType: 'arraybuffer'
        });

        // 将图片数据写入文件
        fs.writeFileSync(filePath, response.data);
        console.log(`保存图片成功: ${filePath}`);
        return filePath;
    } catch (error) {
        console.error('获取云图失败:', error);
        throw error;
    }
}

export { getFutuStockMap, MapType, getYuntuStockMap };