import axios, { AxiosError } from 'axios';
import path from 'path';
import fs from 'fs';

enum MapType {
    hy = 'hy',
    gu = 'gu'
}

const CONFIG = {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    TIMEOUT: 20000
};

type RetryResult<T> = T extends { data: any } ? T | '' : T | '';

async function retry<T>(fn: () => Promise<T>, retries: number = CONFIG.MAX_RETRIES): Promise<RetryResult<T>> {
    try {
        return await fn() as RetryResult<T>;
    } catch (error) {
        if (retries <= 1) return '' as RetryResult<T>;
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
        return retry(fn, retries - 1);
    }
}

async function getFutuStockMap(symbol: string, mapType: MapType) {
    const filePath = path.resolve(process.cwd(), `map/futu-${symbol}-${mapType}.png`);
    
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const response = await retry(async () => {
            try {
                return await axios({
                    method: 'GET',
                    timeout: CONFIG.TIMEOUT,
                    url: `https://nest-stock.zeabur.app/getFutuStockMap/${symbol}/${mapType||'gu'}`,
                    responseType: 'arraybuffer'
                });
            } catch (error) {
                const axiosError = error as AxiosError;
                console.error(`获取富途股市热力图失败: ${axiosError.message}`);
                return '';
            }
        });

        if (!response || !response.data || response.data.length === 0) {
            console.error('接收到的图片数据为空');
            return '';
        }

        await fs.promises.writeFile(filePath, response.data);
        console.log(`保存富途热力图成功: ${filePath}`);
        return filePath;
    } catch (error) {
        console.error(`处理富途热力图失败: ${error instanceof Error ? error.message : '未知错误'}`);
        return '';
    }
}

async function getYuntuStockMap() {
    const filePath = path.resolve(process.cwd(), `map/yuntu.png`);

    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const response = await retry(async () => {
            try {
                return await axios({
                    method: 'GET',
                    timeout: CONFIG.TIMEOUT,
                    url: `https://nest-stock.zeabur.app/getYuntuStockMap`,
                    responseType: 'arraybuffer'
                });
            } catch (error) {
                const axiosError = error as AxiosError;
                console.error(`获取云图失败: ${axiosError.message}`);
                return '';
            }
        });

        if (!response || !response.data || response.data.length === 0) {
            console.error('接收到的图片数据为空');
            return '';
        }

        await fs.promises.writeFile(filePath, response.data);
        console.log(`保存云图成功: ${filePath}`);
        return filePath;
    } catch (error) {
        console.error(`处理云图失败: ${error instanceof Error ? error.message : '未知错误'}`);
        return '';
    }
}

export { getFutuStockMap, MapType, getYuntuStockMap };