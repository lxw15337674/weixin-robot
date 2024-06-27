import axios from 'axios'

interface Quote {
    name: string
    current: number
    percent: number
}
interface StockData {
    data: {
        quote: Quote
    }
    error_code: number
    error_description: string
}

const STOCK_API_URL = 'https://stock.xueqiu.com/v5/stock/quote.json' // Replace with your actual API URL
const SUGGESTION_API_URL = 'https://xueqiu.com/query/v1/suggest_stock.json' // Replace with your actual API URL
// 读取环境变量
let COOKIE = ''

export async function getToken(): Promise<string> {
    if (COOKIE)
        return COOKIE

    const res = await axios.get('https://xueqiu.com/')
    const cookies: string[] = res.headers['set-cookie']

    const param: string = cookies.filter(key => key.includes('xq_a_token'))[0] || ''
    const token = param.split(';')[0] || ''
    COOKIE = token
    return token
}

// https://xueqiu.com/query/v1/suggest_stock.json?q=gzmt
export async function getSuggestStock(q: string) {
    const response = await axios.get<StockData>(SUGGESTION_API_URL, {
        params: {
            q,
        },
        headers: {
            Cookie: await getToken(),
        },
    })

    if (response.status === 200)
        return response.data?.data?.[0]?.code
}

export async function getStockData(symbol: string): Promise<string> {
    try {
        if (!symbol)
            symbol = 'szzs'

        // 如果symbol不是纯数字，说明是股票代码，需要转换为股票代码
        if (!/^\d+$/.test(symbol))
            symbol = await getSuggestStock(symbol)

        if (!symbol)
            return '未找到相关股票'

        const response = await axios.get<StockData>(STOCK_API_URL, {
            params: {
                symbol,
            },
            headers: {
                Cookie: await getToken(),
            },
        })
        if (response.status === 200 && response?.data?.data?.quote) {
            const quote = response.data.data.quote
            const isGrowing = response.data.data.quote.percent > 0
            const text = `${quote.name}: ${quote.current} (${isGrowing ? '📈' : '📉'}${quote.percent}%)`
            return text
        }
        else {
            console.error(`Failed to fetch stock data for ${symbol}: ${response.status}`)
            return `Failed to fetch stock data for ${symbol}: ${response.status}`
        }
    }
    catch (error) {
        console.error(`Error fetching stock data for ${symbol}:`, error)
        return ''
    }
}
