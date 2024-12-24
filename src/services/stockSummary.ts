import axios, { AxiosError } from "axios";
import { Decimal } from 'decimal.js';

// 腾讯微证券热点数据
const URL = "https://wzq.tenpay.com/cgi/cgi-bin/dapan/index?app=wzq%27";

// 基础类型
type StringNumber = string;
type StringDate = string;
type Timestamp = string;

// K线数据点
type KLineDataItem = [StringDate, StringNumber, StringNumber];

// 分时数据点

// 估值区间
interface ValuationInterval {
    index_code: string;
    index_name: string;
    pe_hist_percentile: number;
    pe_interval: number[];
    pe_interval_benchmark: number[];
    pe_ttm: number;
    value: KLineDataItem[];
}

// 指数估值
interface IndexValuation {
    sh000001: ValuationInterval;
    sz399001: ValuationInterval;
    sz399006: ValuationInterval;
}

// 北向资金
interface NorthBoundFlow {
    date: string;
    fund_flow_net_in: number;
    day_flag: number;
    close_flag: boolean;
    history: {
        code: string;
        data: string[];
    };
    history_total: number;
    fund_flow_net_in_detail: null;
    market_close_type: boolean;
    market_close: string;
}

// 上涨下跌家数
interface UpsDowns {
    down_count: number;
    up_count: number;
    flat_count: number;
    down_limit_count: number;
    up_limit_count: number;
    suspension_count: number;
    up_ratio: number;
    up_ratio_comment: string;
    detail: Array<{
        section: string;
        count: number;
        flag: number;
    }>;
}

// 成交额数据
interface Turnover {
    all: {
        volume: number;
        amount: number;
        amount_change: number;
    };
    sh: {
        volume: number;
        amount: number;
        amount_change: number;
    };
    sz: {
        volume: number;
        amount: number;
        amount_change: number;
    };
}

// 涨跌分布分时
interface UpsDownsMinute {
    code: string;
    date: string;
    pre: string;
    data: string[];
}

// 全球市场反应
interface GlobalReaction {
    sh_history: {
        code: string;
        data: string[];
    };
    fucn_minute: {
        code: string;
        date: string;
        pre: string;
        data: string[];
    } | null;
    fucn_history: {
        code: string;
        data: string[];
    };
    fxdiniw_minute: null;
    fxdiniw_history: {
        code: string;
        data: string[];
    };
    usbond_history: {
        code: string;
        data: string[];
    };
    comment: string;
}

// 主响应接口
interface MarketResponse {
    code: number;
    data: {
        top_state: {
            MarketStat: string;
            MarketStatSGXS: string;
            QuoteTime: string;
        };
        minute_set: {
            minute_board_zt: UpsDownsMinute;
            minute_sh_index: UpsDownsMinute;
        };
        turnover_dsb: Turnover;
        ups_downs_dsb: UpsDowns;
        ups_downs_minute: {
            [key: string]: UpsDownsMinute;
        };
        ups_and_downs_history: {
            hsAUpsRatio: {
                code: string;
                data: string[];
            };
        };
        board_stock_rank: Array<{
            code: string;
            name: string;
            price: string;
            zdf: string;
        }>;
        north_bound: NorthBoundFlow;
        comments: null;
        total_amount: string[];
        index_valuation: IndexValuation;
        global_reaction: GlobalReaction;
    };
    msg: string;
}

export type { MarketResponse };
export async function getStockSummary(): Promise<string | undefined> {
    try {
        const response = await axios<MarketResponse>({
            method: 'GET',
            url: URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = response.data.data;
        
        // 格式化金额，使用Decimal处理精度
        const formatAmount = (num: number) => {
            const isNegative = num < 0;
            const absNum = Math.abs(num);

            let result = '';
            if (absNum >= 100000000) { // 亿
                result = new Decimal(absNum).dividedBy(100000000).toDecimalPlaces(2).toString() + '亿';
            } else if (absNum >= 10000) { // 万
                result = new Decimal(absNum).dividedBy(10000).toDecimalPlaces(2).toString() + '万';
            } else {
                result = new Decimal(absNum).toDecimalPlaces(2).toString();
            }

            return isNegative ? '-' + result : result;
        };
        
        let text = `📊 今日市场概览\n`;
        text += `----------------------------------------\n`;
        text += `💰 成交情况\n`;
        text += `总成交额: ${formatAmount(data.turnover_dsb.all.amount)}\n`;
        text += `较前日: ${formatAmount(data.turnover_dsb.all.amount_change)}\n\n`;
        
        text += `📈 市场表现\n`;
        text += `上涨家数: ${data.ups_downs_dsb.up_count}\n`;
        text += `下跌家数: ${data.ups_downs_dsb.down_count}\n`;
        text += `平盘家数: ${data.ups_downs_dsb.flat_count}\n`;
        text += `市场情绪: ${data.ups_downs_dsb.up_ratio_comment}\n\n`;
        
        text += `🌏 国际联动\n`;
        text += `${data.global_reaction.comment}\n\n`;
        
        text += `📊 估值水平 (历史百分位)\n`;
        text += `上证指数: ${data.index_valuation.sh000001.pe_hist_percentile}%\n`;
        text += `深圳成指: ${data.index_valuation.sz399001.pe_hist_percentile}%\n`;
        text += `创业板: ${data.index_valuation.sz399006.pe_hist_percentile}%\n`;
        return text;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error(`获取热点数据失败: ${axiosError.message}`);
        return `❌ 获取市场数据失败，请稍后重试`;
    }
}
