import puppeteer from 'puppeteer';
import path from 'path';

async function captureScreenshot(symbol: string) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox','--lang=zh-CN']
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
        const filePath = path.resolve(process.cwd(), `map/${symbol}.png`);
        await view.screenshot({ path: filePath });
        console.log(`截图成功: ${filePath}`);
        // 返回图片绝对路径
        return filePath;
    } catch (error) {
        console.error(`截图失败: ${error}`);
        const filePath = path.resolve(process.cwd(), `map/${symbol}.png`);
        return filePath; 
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

export { captureScreenshot };