import { Browser, Page, chromium } from 'playwright';

export enum MapType {
    hy = 'hy',
    gu = 'gu'
}
export enum Area {
    'hk' = 'hk',
    'us' = 'us',
    'cn' = 'cn'
}
const config = {
    headless: true,
    args: ['--no-sandbox',           // Docker 环境必需
        '--disable-setuid-sandbox', // 配合 no-sandbox
    ]
}
let browser: Browser | null = null;
let page: Page | null = null;
let isFutuProcessing = false;
let isYuntuProcessing = false;
// 缓存变量
interface CacheData {
    buffer: Buffer;
    updateTime: number;
}

interface StockMapCache {
    [key: string]: CacheData;
}

let stockMapCache: StockMapCache = {};
const CACHE_EXPIRE_TIME = 1 * 60 * 1000; // 1分钟缓存过期

// 清理过期缓存
function clearExpiredCache() {
    const now = Date.now();
    Object.keys(stockMapCache).forEach(key => {
        if (now - stockMapCache[key].updateTime > CACHE_EXPIRE_TIME) {
            delete stockMapCache[key];
        }
    });
}

async function getPage(): Promise<Page> {
    if (!browser) {
        browser = await chromium.launch(config);
    }
    if (!page) {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.setViewportSize({
            width: 1920,
            height: 1080
        });
    }
    return page;
}

async function getFutuStockMap(area: string, mapType: string): Promise<Buffer> {
    const cacheKey = `futu-${area}-${mapType}`;
    const now = Date.now();

    // 检查缓存
    if (stockMapCache[cacheKey] && now - stockMapCache[cacheKey].updateTime < CACHE_EXPIRE_TIME) {
        console.log(`[${new Date().toLocaleString()}] 命中缓存: Futu ${area}-${mapType}`);
        return stockMapCache[cacheKey].buffer;
    }

    if (isFutuProcessing) {
        console.log(`[${new Date().toLocaleString()}] 正在处理中，返回旧缓存: Futu ${area}-${mapType}`);
        return stockMapCache[cacheKey].buffer;
    }

    try {
        isFutuProcessing = true;
        console.log(`[${new Date().toLocaleString()}] 开始获取 Futu 行情图: ${area}-${mapType}`);
        clearExpiredCache();

        // 参数校验
        if (!Object.values(Area).includes(area as Area)) {
            area = Area.cn;
        }
        if (!Object.values(MapType).includes(mapType as MapType)) {
            mapType = MapType.gu;
        }

        const currentPage = await getPage();
        await currentPage.goto(`https://www.futunn.com/quote/${area}/heatmap`, {
            waitUntil: 'networkidle'
        });
        if (mapType === MapType.hy) {
            await currentPage.click('.select-component.heatmap-list-select');
            await currentPage.evaluate(() => {
                const parentElement = document.querySelector('.pouper.max-hgt');
                (parentElement?.children[1] as HTMLElement)?.click();
            });
        }
        await currentPage.waitForTimeout(3000);
        const view = await currentPage.locator('.quote-page.router-page');
        const buffer = await view.screenshot() as Buffer;
        stockMapCache[cacheKey] = {
            buffer,
            updateTime: now
        };
        console.log(`[${new Date().toLocaleString()}] Futu 行情图更新成功: ${area}-${mapType}`);
        return buffer;
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Futu 行情图获取失败:`, error);
        return stockMapCache[cacheKey].buffer;
    } finally {
        isFutuProcessing = false;
    }
}

async function getYuntuStockMap(): Promise<Buffer | null> {
    const cacheKey = 'yuntu';
    const now = Date.now();

    if (stockMapCache[cacheKey] && now - stockMapCache[cacheKey].updateTime < CACHE_EXPIRE_TIME) {
        console.log(`[${new Date().toLocaleString()}] 命中缓存: 云图`);
        return stockMapCache[cacheKey].buffer;
    }

    if (isYuntuProcessing) {
        console.log(`[${new Date().toLocaleString()}] 正在处理中，返回旧缓存: 云图`);
        return stockMapCache[cacheKey]?.buffer;
    }

    try {
        isYuntuProcessing = true;
        console.log(`[${new Date().toLocaleString()}] 开始获取云图行情`);
        clearExpiredCache();

        const currentPage = await getPage();
        await currentPage.goto(`https://dapanyuntu.com/`, {
            waitUntil: 'networkidle'
        });

        await currentPage.waitForTimeout(8000);
        const view = await currentPage.locator('#body');
        const buffer = await view.screenshot() as Buffer;
        stockMapCache[cacheKey] = {
            buffer,
            updateTime: now
        };
        console.log(`[${new Date().toLocaleString()}] 云图行情更新成功`);

        return buffer;
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] 云图获取失败:`, error);
        return stockMapCache[cacheKey].buffer;
    } finally {
        isYuntuProcessing = false;
    }
}

export { getFutuStockMap, getYuntuStockMap };