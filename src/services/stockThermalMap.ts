import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';
import { randomSleep } from '../utils/sleep';
import fs from 'fs';

enum MapType {
    hy = 1,
    gu = 2
}

const config = {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-accelerated-2d-canvas',
        '--memory-pressure-off',  // 防止内存压力
        '--max-old-space-size=4096', // 增加内存限制
    ],
    timeout: 30000 // 设置超时时间
}
let browser: Browser | null = null;
let page: Page | null = null;
let isProcessing = false;

async function getPage(): Promise<Page> {
    if (!browser) {
        browser = await puppeteer.launch(config);
    }
    if (!page || page.isClosed()) {
        page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080
        });
    }
    return page;
}

async function getFutuStockMap(symbol: string, mapType: MapType) {
    const filePath = path.resolve(process.cwd(), `map/futu-${symbol}-${mapType}.png`);

    if (isProcessing) {
        // 检查文件是否存在
        if (fs.existsSync(filePath)) {
            return filePath;
        }
        return '另一个截图任务正在进行中...';
    }

    try {
        isProcessing = true;
        mapType = mapType || MapType.hy;

        const currentPage = await getPage();
        await currentPage.goto(`https://www.futunn.com/quote/${symbol}/heatmap`, {
            waitUntil: 'networkidle2'
        });

        if (mapType === MapType.hy) {
            await currentPage.click('.select-component.heatmap-list-select');
            await currentPage.evaluate(() => {
                const parentElement = document.querySelector('.pouper.max-hgt');
                (parentElement?.children[1] as HTMLElement)?.click();
            });
        }

        await randomSleep(3000, 4000);
        let view = await currentPage.$('.quote-page.router-page');
        await view.screenshot({ path: filePath });
        console.log(`截图成功: ${filePath}`);

        return filePath;
    } finally {
        isProcessing = false;
    }
}

async function getYuntuStockMap(symbol: string) {
    const filePath = path.resolve(process.cwd(), `map/yuntu-${symbol}.png`);

    if (isProcessing) {
        // 检查文件是否存在
        if (fs.existsSync(filePath)) {
            return filePath;
        }
        return '另一个截图任务正在进行中...';
    }

    try {
        isProcessing = true;

        const currentPage = await getPage();
        await currentPage.goto(`https://dapanyuntu.com/`, {
            waitUntil: 'networkidle2'
        });

        await randomSleep(3000, 4000);
        let view = await currentPage.$('#body');
        await view.screenshot({ path: filePath });
        console.log(`截图成功: ${filePath}`);
        return filePath;
    } finally {
        isProcessing = false;
    }
}

export { getFutuStockMap, MapType, getYuntuStockMap };