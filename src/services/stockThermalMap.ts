import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';
import { randomSleep } from '../utils/sleep';

enum MapType {
    hy = 1,
    gu = 2
}

const config = {
    headless: true,
    args: ['--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu']
}
let browser: Browser | null = null;
let futuPage: Page | null = null;
let yuntuPage: Page | null = null;

async function getFutuStockMap(symbol: string, mapType: MapType) {
    mapType = mapType || MapType.hy;
    if (!browser) {
        browser = await puppeteer.launch(config);
        // 确保浏览器不会被关闭
        await browser.newPage();
    }
    const filePath = path.resolve(process.cwd(), `map/futu-${symbol}-${mapType}.png`);
    if(futuPage && !futuPage.isClosed()) {
        return filePath;
    }
    futuPage = await browser.newPage();
    await futuPage.setViewport({
        width: 1920,
        height: 1080
    });
    await futuPage.goto(`https://www.futunn.com/quote/${symbol}/heatmap`, {
        waitUntil: 'networkidle2'
    });
    if (mapType === MapType.hy) {
        await futuPage.click('.select-component.heatmap-list-select');
        await futuPage.evaluate(() => {
            const parentElement = document.querySelector('.pouper.max-hgt');
            (parentElement?.children[1] as HTMLElement)?.click();
        });
    }
    await randomSleep(3000, 4000)
    let view = await futuPage.$('.quote-page.router-page');
    await view.screenshot({ path: filePath });
    console.log(`截图成功: ${filePath}`);
    await futuPage.close();
    futuPage = null;
    // 返回图片绝对路径
    return filePath;
}

async function getYuntuStockMap(symbol: string) {
    if (!browser) {
        browser = await puppeteer.launch(config);
        // 确保浏览器不会被关闭
        await browser.newPage();
    }
    const filePath = path.resolve(process.cwd(), `map/yuntu-${symbol}.png`);
    if(yuntuPage && !yuntuPage.isClosed()) {
        return filePath;
    }
    yuntuPage = await browser.newPage();
    await yuntuPage.setViewport({
        width: 1920,
        height: 1080
    });
    await yuntuPage.goto(`https://dapanyuntu.com/`, {
        waitUntil: 'networkidle2'
    });
    await randomSleep(3000, 4000)
    let view = await yuntuPage.$('#body');
    await view.screenshot({ path: filePath });
    console.log(`截图成功: ${filePath}`);
    await yuntuPage.close();
    yuntuPage = null;
    // 返回图片绝对路径
    return filePath;
}

export { getFutuStockMap, MapType, getYuntuStockMap };