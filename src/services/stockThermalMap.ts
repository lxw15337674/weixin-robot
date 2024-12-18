import puppeteer from 'puppeteer';
import path from 'path';
import { randomSleep } from '../utils/sleep';

enum MapType {
    hy = 'hy',
    gu = 'gu'
}

async function getFutuStockMap(symbol: string, mapType: MapType ) {
    mapType = mapType || MapType.hy;
    let browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    await page.goto(`https://www.futunn.com/quote/${symbol}/heatmap`, {
        waitUntil: 'networkidle2'
    });
    if (mapType === MapType.hy) {
        await page.click('.select-component.heatmap-list-select');
        await page.evaluate(() => {
            const parentElement = document.querySelector('.pouper.max-hgt');
            (parentElement?.children[1] as HTMLElement)?.click();
        });
        await randomSleep(3000, 4000)
    }
    let view = await page.$('.quote-page.router-page');
    const filePath = path.resolve(process.cwd(), `map/futu-${symbol}-${mapType}.png`);
    await view.screenshot({ path: filePath });
    console.log(`截图成功: ${filePath}`);
    await browser.close();
    // 返回图片绝对路径
    return filePath;
}


async function getYuntuStockMap(symbol: string) {
    let browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    await page.goto(`https://dapanyuntu.com/`, {
        waitUntil: 'networkidle2'
    });
    let view = await page.$('#body');
    const filePath = path.resolve(process.cwd(), `map/yuntu-${symbol}.png`);
    await randomSleep(3000, 4000)
    await view.screenshot({ path: filePath });
    console.log(`截图成功: ${filePath}`);
    await browser.close();
    // 返回图片绝对路径
    return filePath;
}

export { getFutuStockMap, MapType, getYuntuStockMap };