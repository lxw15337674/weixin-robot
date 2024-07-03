import { formatAmount } from '../utils/convertToNumber';
import axios from 'axios'

interface Quote {
    /** 股票代码（包含交易所信息） */
    symbol: string;
    /** 股票代码（不包含交易所信息） */
    code: string;
    /** 平均成交价格 */
    avg_price: number;
    /** 是否延迟，0 表示实时数据 */
    delayed: number;
    /** 数据类型，例如：11 代表 A 股 */
    type: number;
    /** 涨跌幅（百分比） */
    percent: number;
    /** 最小变动单位 */
    tick_size: number;
    /** 流通股本 */
    float_shares: number;
    /** 振幅 */
    amplitude: number;
    /** 当前价格 */
    current: number;
    /** 最高价 */
    high: number;
    /** 年初至今涨跌幅 */
    current_year_percent: number;
    /** 流通市值 */
    float_market_capital: number;
    /** 上市日期 */
    issue_date: number;
    /** 最低价 */
    low: number;
    /** 股票子类型，例如：3 代表创业板 */
    sub_type: string;
    /** 总市值 */
    market_capital: number;
    /** 货币单位 */
    currency: string;
    /** 每手股数 */
    lot_size: number;
    /** 限售股信息 */
    lock_set: any | null; // 需要根据实际数据结构定义
    /** 时间戳 */
    timestamp: number;
    /** 成交额 */
    amount: number;
    /** 涨跌额 */
    chg: number;
    /** 昨日收盘价 */
    last_close: number;
    /** 成交量 */
    volume: number;
    /** 换手率 */
    turnover_rate: number;
    /** 股票名称 */
    name: string;
    /** 交易所 */
    exchange: string;
    /** 时间 */
    time: number;
    /** 总股本 */
    total_shares: number;
    /** 开盘价 */
    open: number;
    /** 股票状态 */
    status: number;
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
export async function getStockBasicData(symbol: string): Promise<Quote> {
    try {
        if (!symbol)
            symbol = 'szzs'
        symbol = await getSuggestStock(symbol)

        if (!symbol)
            throw new Error('未找到相关股票')

        const response = await axios.get<StockData>(STOCK_API_URL, {
            params: {
                symbol,
            },
            headers: {
                Cookie: await getToken(),
            },
        })
        if (response.status === 200 && response?.data?.data?.quote) {
            return response.data.data.quote
        }
        else {
            throw new Error(`Failed to fetch stock data for ${symbol}: ${response.status}`)
        }
    }
    catch (error) {
        throw error
    }
}
export async function getStockData(symbol: string): Promise<string> {
    try {
        const basicData = await getStockBasicData(symbol)
        const isGrowing = basicData.percent > 0
        const text = `${basicData?.name}: ${basicData.current} (${isGrowing ? '📈' : '📉'}${basicData.percent}%)`
        return text
    } catch (error) {
        return error.message
    }
}

const keyMap = [
    {
        label: '最高价',
        key: 'high',
    },
    {
        label: '最低价',
        key: 'low',
    },
    {
      label:'平均成交价格',
        key:'avg_price'
    },
    {
        label: '年初至今涨跌幅',
        key:'current_year_percent',
        callback: (value: number) => `${value}%`
    },
    {
        label: '振幅',
        key: 'amplitude',
        callback: (value: number) => `${value}%`,
    },
    {
        label: '成交额',
        key: 'amount',
        callback: (value: number) => `${formatAmount(value)}`,
    },
    {
        label: '成交量',
        key: 'volume',
        callback: (value: number) => `${formatAmount(value)}手`,
    },
    {
        label: '换手率',
        key: 'turnover_rate',
        callback: (value: number) => `${value}%`,
    },
];
export async function getStockDetailData(symbol: string): Promise<string> {
    try {
        const basicData = await getStockBasicData(symbol)
        const isGrowing = basicData.percent > 0
        const text = `${basicData?.name}: ${basicData.current} (${isGrowing ? '📈' : '📉'}${basicData.percent}%)`
        const detailText = keyMap.reduce((prev, current) => {
            return `${prev}\n${current.label}: ${current.callback ? current.callback(basicData[current.key]) : basicData[current.key]}`
        }, '')
        return `${text}${detailText}`
    } catch (error) {
        return error.message
    }
}