import axios from "axios";
import { decode } from 'iconv-lite';

const Binance_API_URL = 'https://data-api.binance.vision/api/v3/ticker/24hr' // Replace with your actual API URL
// const SUGGESTION_API_URL = 'https://data-api.binance.vision/api/v3/exchangeInfo' // Replace with your actual API URL


// export async function getBinanceSuggest(searchText = 'XAU'): Promise<string> {
//     try {
//         const futureResponse = await axios.get(SUGGESTION_API_URL,);
//         return code
//     } catch (err) {
//         return err.message
//     }
// }

interface BinanceData {
    // 交易对名称，例如 BTCUSDT
    symbol: string;
    // 24 小时内价格变化量
    priceChange: string;
    // 24 小时内价格变化百分比
    priceChangePercent: string;
    // 24 小时内的加权平均价格
    weightedAvgPrice: string;
    // 前一个交易日的收盘价
    prevClosePrice: string;
    // 最新成交价
    lastPrice: string;
    // 最新成交量
    lastQty: string;
    // 买一价
    bidPrice: string;
    // 买一量
    bidQty: string;
    // 卖一价
    askPrice: string;
    // 卖一量
    askQty: string;
    // 24 小时内开盘价
    openPrice: string;
    // 24 小时内最高价
    highPrice: string;
    // 24 小时内最低价
    lowPrice: string;
    // 24 小时内成交量
    volume: string;
    // 24 小时内成交额
    quoteVolume: string;
    // 24 小时统计周期的开始时间戳 (毫秒)
    openTime: number;
    // 24 小时统计周期的结束时间戳 (毫秒)
    closeTime: number;
    // 该时间段内的第一个交易 ID
    firstId: number;
    // 该时间段内的最后一个交易 ID
    lastId: number;
    // 该时间段内的交易次数
    count: number;
}

export async function getBinanceData(symbol: string): Promise<string> {
    try {
        console.log(`${symbol.toLocaleUpperCase()}USDT`,)
        const response = await axios.get<BinanceData>(Binance_API_URL, {
            params: {
                symbol: `${symbol.toLocaleUpperCase()}USDT`,
            },
        })

        if (response.status === 200) {
            const {data} = response
            const price = Number(data.lastPrice)
            const percent = Number(data.priceChangePercent).toFixed(2)
            const isGrowing = Number(percent) > 0;
            const text = `${data.symbol}: $${price} (${isGrowing ? '📈' : '📉'}${percent}%)`
            return text
        }
        else {
            return `获取 ${symbol} 数据失败: ${response.status}`
        }
    }
    catch (error) {
        return `获取 ${symbol} 数据失败: ${error.message}`
    }
}