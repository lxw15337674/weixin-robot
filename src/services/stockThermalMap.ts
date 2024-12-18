import puppeteer from 'puppeteer';
// ...existing code...


async function captureScreenshot(symbol: string) {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    await page.goto(`https://www.futunn.com/quote/${symbol}/heatmap`, {
        waitUntil: 'networkidle2'
    });

    await page.waitForSelector('.quote-page.router-page');
    let view = await page.$('.quote-page.router-page');
    await view.screenshot({ path: `${symbol}.png` });
    await browser.close();
    // 返回图片路径
    return `${symbol}.png`;
}

export { captureScreenshot };
