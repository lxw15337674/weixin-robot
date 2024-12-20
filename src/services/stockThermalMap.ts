import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';
import { randomSleep } from '../utils/sleep';
import fs from 'fs';

enum MapType {
    hy = 'hy',
    gu = 'gu'
}

const config = {
    headless: true,
    args: ['--no-sandbox',           // Docker 环境必需
        '--disable-setuid-sandbox', // 配合 no-sandbox
        '--disable-dev-shm-usage',  // 防止内存问题
        '--disable-gpu',           // 提高稳定性
        '--disable-software-rasterizer', // 优化性能
        '--disable-accelerated-2d-canvas' // 禁用加速
    ]
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

// 这个功能会导致意外退出，暂时不用
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