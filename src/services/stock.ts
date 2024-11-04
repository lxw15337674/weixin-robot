import { formatAmount } from '../utils/convertToNumber';
import axios from 'axios'

interface Market {
    status_id: number; // 市场状态ID，2代表盘前交易
    region: string; // 地区，例如 "US" 代表美国
    status: string; // 市场状态描述，例如 "盘前交易",5代表盘中交易
    time_zone: string; // 时区，例如 "America/New_York"
    time_zone_desc: string | null; // 时区描述
    delay_tag: number; // 延迟标识
}

interface Quote {

    current_ext?: number; // 当前价格（扩展精度）
    symbol: string; // 股票代码
    high52w: number; // 52 周最高价
    percent_ext: number; // 涨跌幅（扩展精度）
    delayed: number; // 延迟标识
    type: number; // 股票类型
    tick_size: number; // 最小变动单位
    float_shares: number | null; // 流通股数
    high: number; // 当日最高价
    float_market_capital: number | null; // 流通市值
    timestamp_ext: number; // 时间戳（扩展精度）
    lot_size: number; // 每手股数
    lock_set: number; // 锁定标识
    chg: number; // 涨跌额
    eps: number; // 每股收益
    last_close: number; // 昨日收盘价
    profit_four: number; // 四季度净利润
    volume: number; // 成交量
    volume_ratio: number; // 量比
    profit_forecast: number; // 预测净利润
    turnover_rate: number; // 换手率
    low52w: number; // 52 周最低价
    name: string; // 股票名称
    exchange: string; // 交易所
    pe_forecast: number; // 预测市盈率
    total_shares: number; // 总股本
    status: number; // 股票状态
    code: string; // 股票代码
    goodwill_in_net_assets: number; // 商誉占净资产比例
    avg_price: number; // 平均价格
    percent: number; // 涨跌幅
    psr: number; // 市销率
    amplitude: number; // 振幅
    current: number; // 当前价格
    current_year_percent: number; // 年初至今涨跌幅
    issue_date: number; // 上市日期（时间戳）
    sub_type: string; // 子类型
    low: number; // 当日最低价
    market_capital: number; // 总市值
    shareholder_funds: number; // 股东权益
    dividend: number | null; // 股息
    dividend_yield: number | null; // 股息率
    currency: string; // 货币单位
    chg_ext: number; // 涨跌额（扩展精度）
    navps: number; // 每股净资产
    profit: number; // 净利润
    beta: number | null; // 贝塔系数
    timestamp: number; // 时间戳
    pe_lyr: number; // 静态市盈率
    amount: number; // 成交额
    pledge_ratio: number | null; // 质押比例
    short_ratio: number | null; // 做空比例
    inst_hld: number | null; // 机构持股比例
    pb: number; // 市净率
    pe_ttm: number; // 滚动市盈率
    contract_size: number; // 合约单位
    variable_tick_size: string; // 可变最小变动单位
    time: number; // 时间（时间戳）
    open: number; // 开盘价
}

interface Others {
    pankou_ratio: number; // 盘口比例
    cyb_switch: boolean; // 创业板标识
}

interface Tag {
    description: string; // 标签描述
    value: number; // 标签值
}

interface StockData {
    data: {
        market: Market; // 市场相关信息
        quote: Quote; // 股票报价信息
        others: Others; // 其他信息
        tags: Tag[]; // 标签信息
    };
    error_code: number; // 错误代码
    error_description: string; // 错误描述
}

const STOCK_API_URL = 'https://stock.xueqiu.com/v5/stock/quote.json' // Replace with your actual API URL
const SUGGESTION_API_URL = 'https://xueqiu.com/query/v1/suggest_stock.json' // Replace with your actual API URL
// 读取环境变量
let Cookie = '';
let cookieTimestamp = 0;
const COOKIE_EXPIRATION_TIME = 2 * 24 * 60 * 60 * 1000; // 2天

export async function getToken(): Promise<string> {
    const now = Date.now();
    if (Cookie && (now - cookieTimestamp) < COOKIE_EXPIRATION_TIME) {
        return Cookie;
    }
    const cookieKey = 'xq_a_token';

    try {
        // 先请求第一个 URL
        const res1 = await axios.get('https://xueqiu.com/about');
        Cookie = res1.headers['set-cookie']?.find(c => c.includes(cookieKey))?.split(';')[0];
        if (!Cookie) {
            throw new Error(`Failed to get ${cookieKey} cookie.`);
        }
        cookieTimestamp = now; // 记录获取 Cookie 的时间
        return Cookie;
    } catch (error) {
        console.error('Error getting cookie:', error);
        throw error;
    }
}

// https://xueqiu.com/query/v1/suggest_stock.json?q=gzmt
export async function getSuggestStock(q: string) {

    const response = await axios.get<StockData>(SUGGESTION_API_URL, {
        params: {
            q,
        },
        headers: {
            Cookie: await getToken()
        },
    })

    if (response.status === 200)
        return response.data?.data?.[0]?.code
}

export async function getStockBasicData(symbol: string): Promise<StockData['data']> {
    try {
        symbol = await getSuggestStock(symbol)

        if (!symbol)
            throw new Error('未找到相关股票')

        const response = await axios.get<StockData>(STOCK_API_URL, {
            params: {
                symbol,
                extend: 'detail'
            },
            headers: {
                Cookie: await getToken(),
            },
        })
        if (response.status === 200 && response?.data?.data?.quote) {
            return response.data.data
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
        const { quote, market } = await getStockBasicData(symbol)
        const isGrowing = quote.percent > 0
        let text = `${quote?.name}(${quote?.symbol}): ${quote.current}`;
        if (quote.percent !== null) {
            text += ` (${isGrowing ? '📈' : '📉'}${quote.percent.toFixed(2)}%)`;
        }
        // 盘前数据
        if (quote.current_ext && quote.percent_ext && quote.current !== quote.current_ext && market.status_id !== 5) {
            const isGrowing = quote.percent_ext > 0
            let extText = `盘前交易:${quote.current_ext} (${isGrowing ? '📈' : '📉'}${quote.percent_ext?.toFixed(2)}%)`
            text = `${text}\n${extText}`
        }
        return text
    } catch (error) {
        return `获取股票${symbol}数据失败: ${error.message}`
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
        label: '平均成交价格',
        key: 'avg_price'
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
    {
        label: '总市值',
        key: 'market_capital',
        callback: (value: number) => `${formatAmount(value)}`
    },
    {
        label: '年初至今涨跌幅',
        key: 'current_year_percent',
        callback: (value: number) => `${value}%`
    },
    {
        label: '市盈率(TTM)',
        key: 'pe_ttm',
        callback: (value: number) => `${value}`
    },
    {
        label: '市净率',
        key: 'pb',
        callback: (value: number) => `${value}`
    },
    {
        label: '股息率',
        key: 'dividend_yield',
        callback: (value: number) => `${value}%`
    }
];
export async function getStockDetailData(symbol: string): Promise<string> {
    try {
        const { quote } = await getStockBasicData(symbol)
        const isGrowing = quote.percent > 0
        const text = `${quote?.name}(${quote?.symbol}): ${quote.current} (${isGrowing ? '📈' : '📉'}${quote.percent}%)`
        const detailText = keyMap.reduce((prev, current) => {
            let value = quote[current.key]
            if (value === undefined || value === null) {
                return prev
            }
            if (current.callback) {
                value = current.callback(value)
            }
            return `${prev}\n${current.label}: ${value}`
        }, '')
        return `${text}\n${detailText}`
    } catch (error) {
        return `获取股票${symbol}数据失败: ${error.message}`
    }
}