import { Browser, Page, chromium } from 'playwright';
import { saveBufferToImage } from '../../utils/save';

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
    filePath?: string;
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

// 添加浏览器清理函数
async function closeBrowser() {
    if (browser) {
        await browser.close();
        browser = null;
        page = null;
    }
}

async function getFutuStockMap(area: string, mapType: string): Promise<string | null> {
    // 参数校验
    if (!Object.values(Area).includes(area as Area)) {
        area = Area.cn;
    }
    if (!Object.values(MapType).includes(mapType as MapType)) {
        mapType = MapType.gu;
    }
    const cacheKey = `futu-${area}-${mapType}`;
    const now = Date.now();

    // 检查缓存
    if (stockMapCache[cacheKey] && now - stockMapCache[cacheKey].updateTime < CACHE_EXPIRE_TIME) {
        console.log(`[${new Date().toLocaleString()}] 命中缓存: ${cacheKey}`);
        return stockMapCache[cacheKey].filePath || null;
    }

    if (isFutuProcessing) {
        console.log(`[${new Date().toLocaleString()}] 正在处理中，返回旧缓存: ${cacheKey}`);
        return stockMapCache[cacheKey]?.filePath || null;
    }

    try {
        isFutuProcessing = true;
        console.log(`[${new Date().toLocaleString()}] 开始获取 Futu 行情图: cacheKey`);
        clearExpiredCache();

       

        const currentPage = await getPage();
        await currentPage.goto(`https://www.futunn.com/quote/${area}/heatmap`, {
            waitUntil: 'load',
        })
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
        const filePath = await saveBufferToImage(buffer, cacheKey);
        stockMapCache[cacheKey] = {
            filePath,
            updateTime: now
        };
        console.log(`[${new Date().toLocaleString()}] Futu 行情图更新成功: cacheKey`);
        return stockMapCache[cacheKey].filePath || null;
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Futu 行情图获取失败:`, error);
        // 发生错误时清理浏览器实例
        await closeBrowser();
        return stockMapCache[cacheKey]?.filePath || null;
    } finally {
        isFutuProcessing = false;
        await closeBrowser();
    }
}

async function getYuntuStockMap(): Promise<string | null> {
    const cacheKey = 'yuntu';
    const now = Date.now();

    // 检查缓存
    if (stockMapCache[cacheKey] && now - stockMapCache[cacheKey].updateTime < CACHE_EXPIRE_TIME) {
        console.log(`[${new Date().toLocaleString()}] 命中缓存: ${cacheKey}`);
        return stockMapCache[cacheKey].filePath || null;
    }

    if (isYuntuProcessing) {
        console.log(`[${new Date().toLocaleString()}] 正在处理中，返回旧缓存: ${cacheKey}`);
        return stockMapCache[cacheKey]?.filePath || null;
    }

    try {
        isYuntuProcessing = true;
        console.log(`[${new Date().toLocaleString()}] 开始获取云图行情`);
        clearExpiredCache();

        const currentPage = await getPage();
        await currentPage.goto(`https://dapanyuntu.com/`, {})
        await currentPage.waitForTimeout(10000);
        const view = await currentPage.locator('#body');
        const buffer = await view.screenshot() as Buffer;
        const filePath = await saveBufferToImage(buffer, cacheKey);
        stockMapCache[cacheKey] = {
            filePath,
            updateTime: now
        };
        console.log(`[${new Date().toLocaleString()}] 云图行情更新成功: ${cacheKey}`);
        
        return stockMapCache[cacheKey].filePath || null;
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] 云图获取失败:`, error);
        // 发生错误时清理浏览器实例
        await closeBrowser();
        return stockMapCache[cacheKey]?.filePath || null;
    } finally {
        isYuntuProcessing = false;
        await closeBrowser();
    }
}

export { getFutuStockMap, getYuntuStockMap, closeBrowser };