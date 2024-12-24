import { getStockData } from './stockInfo';
import { getWeiboData } from './weibo';
import { getAIData } from './ai';
import { afterAll, describe, expect, it } from '@jest/globals';
import { parseCommand } from './actions';
import { formatAmount } from '../utils/convertToNumber';
import { holiday } from './fishingTime';
import { getFutureData, getFutureSuggest } from './future';
import { getBinanceData } from './binance';
import {  getFutuStockMap, getYuntuStockMap, MapType } from './stockThermalMap';
import { getHotSpot } from './stockHotSpot';
import { getStockSummary } from './stockSummary';

describe('getWeiboData', () => {
    it('should fetch Weibo data', async () => {
        const data = await getWeiboData();
        expect(data).not.toBeNull();
    });
});

describe('getStockData', () => {
    it('should return stock data for a valid A-share code', async () => {
        const data = await getStockData('SH600519');
        // 不存在失败文本
        expect(data).not.toMatch(/失败/);
    });

    it('should return stock data for a valid A-share code without prefix', async () => {
        const data = await getStockData('300888');
        expect(data).not.toMatch(/失败/);
    });

    it('should return stock data for a valid stock symbol', async () => {
        const data = await getStockData('gzmt');
        expect(data).not.toMatch(/失败/);
    });

    it('should handle invalid stock codes gracefully', async () => {
        const data = await getStockData('30088888');
        expect(data).toMatch(/失败/);
    });

    it('should handle empty percentage cases', async () => {
        const data = await getStockData('kskj');
        expect(data).not.toMatch(/失败/);
    });

    it('should return pre-market data for US stocks', async () => {
        const data = await getStockData('tesla');
        expect(data).not.toMatch(/失败/);
    });

    it('should return pre-market data for Hong Kong stocks', async () => {
        const data = await getStockData('tx');
        expect(data).not.toMatch(/失败/);
    });

    it('test', async () => {
        const data = await getStockData('中集车辆');
        // Failed to fetch stock data for 中集车辆: 404
        expect(data).not.toMatch(/失败/);
    })

});


describe('get future data', () => {
    it('should return future suggest', async () => {
        const data = await getFutureSuggest('XAU');
        expect(data).not.toBeNull();
    });
    it('should return getFutureBasicData', async () => {
        const data = await getFutureData('XAU');
        expect(data).not.toBeNull();
    })
    it('should return getFutureBasicData', async () => {
        const data = await getFutureData('bo');
        expect(data).not.toBeNull();
    })
});

describe('getAIData', () => {
    it('should fetch AI data', async () => {
        const data = await getAIData('test');
        expect(data).not.toBeNull();
    });
});

describe('parseCommand', () => {
    it('should return undefined for invalid commands', async () => {
        expect(await parseCommand('test')).toBeUndefined();
        expect(await parseCommand('sd')).toBeUndefined();
        expect(await parseCommand('s')).toBeUndefined();
        expect(await parseCommand('f')).toBeUndefined();
        expect(await parseCommand('b')).toBeUndefined();
        expect(await parseCommand('wb ')).toBeUndefined();
        expect(await parseCommand('wb 11')).toBeUndefined();
        
    });

    it('should return data for valid commands', async () => {
        expect(await parseCommand('ss')).not.toBeNull();
        expect(await parseCommand('sd 300888')).not.toBeNull();
        expect(await parseCommand('s ')).not.toBeNull();
        expect(await parseCommand('hy')).not.toBeNull();
        expect(await parseCommand('hp')).not.toBeNull();
        expect(await parseCommand('f xau')).not.toBeNull();
        expect(await parseCommand('b btc')).not.toBeNull();
        expect(await parseCommand('hot')).not.toBeNull();
    });
    it('test US fund', async () => {
        expect(await parseCommand('sd cweb')).not.toBeNull();
    });
    it('test CN fund', async () => {
        expect(await parseCommand('sd 印度基金lof')).not.toBeNull();
        expect(await parseCommand('sd 164824')).not.toBeNull();
    })
    it('test mcn hy', async () => {
        expect(await parseCommand('mcn hy')).not.toBeNull();
    })
});

describe('formatAmount', () => {
    it('should format billions correctly', () => {
        expect(formatAmount(1817000000)).toEqual('18.17亿');
    });

    it('should format ten thousands correctly', () => {
        expect(formatAmount(1234567)).toEqual('123.46万');
    });

    it('should format thousands correctly', () => {
        expect(formatAmount(1234)).toEqual('1234');
    });
});

describe('fishingTime', () => {
    it('should return fishing time', async () => {
        expect(await holiday()).not.toBeNull();
    })
})


describe('binance', () => {
    it('should return binance data', async () => {
        expect(await getBinanceData('btc')).not.toBeNull();
    }
    )
})

describe('stockThermalMap', () => {
    it('should return thermal map', async () => {
        const results = await Promise.all([
            getFutuStockMap('cn', MapType.hy),
            // getFutuStockMap('us'),
            // getFutuStockMap('us')
            // getYuntuStockMap()
        ]);

        results.forEach(result => {
            expect(result).not.toBeNull();
        });
    })
})

describe('getHotSpot', () => {
    it('should return hot spot data', async () => {
        const data = await getHotSpot();
        expect(data).not.toBeUndefined();
        if (data) {
            expect(typeof data).toBe('string');
            expect(data.length).toBeGreaterThan(0);
        }
    });
});


describe('getStockSummary', () => {
    it('should fetch stock summary', async () => {
        const data = await getStockSummary();
        expect(data).not.toBeNull();
    });
});