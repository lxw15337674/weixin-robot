import axios from "axios";

const Future_API_URL = 'http://hq.sinajs.cn/' // Replace with your actual API URL
const SUGGESTION_API_URL = 'http://suggest3.sinajs.cn/suggest/' // Replace with your actual API URL
export async function getFutureSuggest(searchText = 'XAU'): Promise<string> {
    try {
        const futureResponse = await axios.get(SUGGESTION_API_URL, {
            params:{
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

export async function getFutureBasicData(symbol: string): Promise<string> {
    try {
        if (!symbol)
            symbol = 'szzs'
        symbol = await getFutureSuggest(symbol)

        if (!symbol)
            throw new Error('未找到相关期货')

        const response = await axios.get<any>(Future_API_URL, {
            // // axios 乱码解决
            // responseType: 'arraybuffer',
            // transformResponse: [
            //     (data) => {
            //         const body = decode(data, 'GB18030');
            //         return body;
            //     },
            // ],
            params: {
                list: symbol,
            },
            headers: {
                // ...randHeader(),
                Referer: 'http://finance.sina.com.cn/',
            },
        })
        // "var hq_str_hf_XAU=\"2363.49,2356.800,2363.49,2363.84,2366.23,2354.11,15:06:00,2356.80,2356.45,0,0,0,2024-07-05,�׶ؽ��ֻ��ƽ�\";\n"
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