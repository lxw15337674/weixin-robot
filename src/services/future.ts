import axios from "axios";
import { decode } from 'iconv-lite';

const Future_API_URL = 'http://hq.sinajs.cn/' // Replace with your actual API URL
const SUGGESTION_API_URL = 'http://suggest3.sinajs.cn/suggest/' // Replace with your actual API URL

// "var hq_str_hf_XAU=\"2363.44,2356.800,2363.44,2363.79,2366.23,2354.11,15:30:00,2356.80,2356.45,0,0,0,2024-07-05,伦敦金（现货黄金）\";\n"
function extractPrices(hq_str) {
    const match = hq_str.match(/(?:"[^"]*")/);
    const data = match[0]?.slice(1, -1)?.split(',');
    const obj = {
        currentPrice: data[0],
        prePrice: data[1],
        name: data[13]
    }
    const isGrowing = obj.currentPrice > obj.prePrice;
    const percent = ((obj.currentPrice - obj.prePrice) / obj.prePrice * 100).toFixed(2);
    return ` ${obj.name}: ${obj.currentPrice} (${isGrowing ? '📈' : '📉-'}${percent}%)`
}
export async function getFutureSuggest(searchText = 'XAU'): Promise<string> {
    try {
        const futureResponse = await axios.get(SUGGESTION_API_URL, {
            params: {
                type: '85,86,88',
                key: encodeURIComponent(searchText)
            }
            // responseType: 'arraybuffer',
            // transformResponse: [
            //     (data) => {
            //         const body = decode(data, 'GB18030');
            //         return body;
            //     },
            // ],
            // headers: randHeader(),
        });
        const text = futureResponse.data.slice(18, -2)
        if (text === '') {
            return ''
        }
        const arr = text.split(',');
        let code = arr[3];
        let market = arr[1];
        code = code.toUpperCase();
        // 国内交易所
        if (market === '85' || market === '88') {
            code = 'nf_' + code;
        } else if (market === '86') {
            // 海外交易所
            code = 'hf_' + code;
        }
        return code
    } catch (err) {
        return err.message
    }
}

export async function getFutureData(symbol: string): Promise<string> {
    try {
        symbol = await getFutureSuggest(symbol)

        if (!symbol)
            return `Failed to fetch  data for ${symbol}`

        const response = await axios.get<any>(Future_API_URL, {
            // axios 乱码解决
            responseType: 'arraybuffer',
            transformResponse: [
                (data) => {
                    const body = decode(data, 'GB18030');
                    return body;
                },
            ],
            params: {
                list: symbol,
            },
            headers: {
                // ...randHeader(),
                Referer: 'http://finance.sina.com.cn/',
            },
        })

        if (response.status === 200) {
            
            return extractPrices(response.data)
        }
        else {
            return `Failed to fetch  data for ${symbol}: ${response.status}`
        }
    }
    catch (error) {
        return `Failed to fetch  data for ${symbol}: ${error.message}`
    }
}