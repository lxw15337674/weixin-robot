import axios from 'axios';

interface Quote {
    name: string;
    current: number;
    percent: number;
}
interface StockData {
    data: {
        quote: Quote;
    };
    error_code: number;
    error_description: string;
}

const STOCK_API_URL = 'https://stock.xueqiu.com/v5/stock/quote.json'; // Replace with your actual API URL
const SUGGESTION_API_URL = 'https://xueqiu.com/query/v1/suggest_stock.json'; // Replace with your actual API URL
const COOKIE = 'xq_a_token=483932c5fb313ca4c93e7165a31f179fb71e1804; xqat=483932c5fb313ca4c93e7165a31f179fb71e1804; xq_r_token=f3a274495a9b8053787677ff7ed85d1639c6e3e0; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTcyMTQzNjcyOSwiY3RtIjoxNzE5MjA4MTMxODk2LCJjaWQiOiJkOWQwbjRBWnVwIn0.JsMLbAmzWcr-r5C6vcxx04aMqATba09BgHUmKbQgy8v0aRrnCMi5JKqGtrmkNK8kdLTWTTtyEEfe1Ja7vy134IMlZcwAPf1kprSifQWb1DPLdepHXxp8qhZrF5zMOnV2VXhRCIZiczNsAPogCv7RpPfTVlAJfQy73v485EyuQ6nv8ZIXZ0mS8dF6GIT3CIyExzZcIZBGaBPsQF93kv8ulw0-3ZFHDMar0dA8CbmqlzitystkVh2kFuH-x3ADy2--00gHNWbiLuaEBRXV4jDSZHFJqhrp_qmBx86iQetWjIzCtlfF0pmKNWHjcAJawSdMCsETv_AnEbcCPnj-7p_sLg; cookiesu=231719208143906; u=231719208143906; Hm_lvt_1db88642e346389874251b5a1eded6e3=1719208145; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1719208145; device_id=77b4809f80b5f395a411c14d79d8668d'

// https://xueqiu.com/query/v1/suggest_stock.json?q=gzmt
export async function getSuggestStock(q: string) {
    const response = await axios.get<StockData>(SUGGESTION_API_URL, {
        params: {
            q,
        },
        headers: {
            Cookie: COOKIE
        },
    });

    if (response.status === 200) {
        return response.data.data[0].code
    }
}


export async function getStockData(symbol: string): Promise<string> {
    try {
        // 如果symbol不是纯数字，说明是股票代码，需要转换为股票代码
        if (!/^\d+$/.test(symbol)) {
            symbol = await getSuggestStock(symbol);
        }
        if (!symbol) {
            return `未找到相关股票`;
        }
        const response = await axios.get<StockData>(STOCK_API_URL, {
            params: {
                symbol,
            },
            headers: {
                Cookie: COOKIE
            },
        });

        if (response.status === 200) {
            const quote = response.data.data.quote;
            const isGrowing = response.data.data.quote.percent > 0;
            const text = `${quote.name}: ${quote.current} (${isGrowing ? '📈' : '📉'}${quote.percent}%)`;
            return text
        } else {
            console.error(`Failed to fetch stock data for ${symbol}: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching stock data for ${symbol}:`, error);
        return null;
    }
}