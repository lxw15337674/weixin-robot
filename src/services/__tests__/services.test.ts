import { repeatMessage } from './../acions/repeatMessage';
import { getStockData } from '../acions/stockInfo';
import { getWeiboData } from '../acions/weibo';
import { getAIData } from '../acions/ai';
import { describe, expect, it } from '@jest/globals';
import { parseCommand } from '../command';
import { convertToNumber, formatAmount } from '../../utils/convertToNumber';
import { holiday } from '../acions/fishingTime';
import { getFutureData, getFutureSuggest } from '../acions/future';
import { getBinanceData } from '../acions/binance';
import { getFutuStockMap, MapType } from '../acions/stockThermalMap';
import { getHotSpot } from '../acions/stockHotSpot';
import { getStockSummary } from '../acions/stockSummary';

// 市场数据相关测试
describe('Market Data Tests', () => {
    describe('Stock Data', () => {
        // A股测试
        describe('A-Share Tests', () => {
            it('should return data for valid A-share code with prefix', async () => {
                const data = await getStockData('SZ300664');
                expect(data).not.toMatch(/失败/);
            });

            it('should return data for valid A-share code without prefix', async () => {
                const data = await getStockData('300888');
                expect(data).not.toMatch(/失败/);
            });
        });

        // 港股测试
        describe('Hong Kong Stock Tests', () => {
            it('should return data for Hong Kong stocks', async () => {
                const data = await getStockData('tx');
                expect(data).not.toMatch(/失败/);
            });
        });

        // 美股测试
        describe('US Stock Tests', () => {
            it('should return data for US stocks', async () => {
                const data = await getStockData('tesla');
                expect(data).not.toMatch(/失败/);
            });
        });

        // 基金测试
        describe('Fund Tests', () => {
            it('should return data for US funds', async () => {
                const data = await getStockData('cweb');
                expect(data).not.toMatch(/失败/);
            });

            it('should return data for CN funds', async () => {
                const data1 = await getStockData('印度基金lof');
                const data2 = await getStockData('164824');
                expect(data1).not.toMatch(/失败/);
                expect(data2).not.toMatch(/失败/);
            });
        });

        // 多股票查询测试
        describe('Multiple Stocks Query Tests', () => {
            it('should handle multiple stocks with different separators', async () => {
                const data1 = await getStockData('tx xm');
                const data2 = await getStockData('google apple msft');
                expect(data1.split('\n\n').length).toBe(2);
                expect(data2.split('\n\n').length).toBe(3);
            });
        });

        // 异常处理测试
        describe('Error Handling Tests', () => {
            it('should handle invalid stock codes', async () => {
                const data = await getStockData('30088888');
                expect(data).toMatch(/失败/);
            });
        });
    });

    // 期货数据测试
    describe('Future Data Tests', () => {
        it('should return future market data', async () => {
            const basicData = await getFutureData('XAU');
            const suggestData = await getFutureSuggest('XAU');
            expect(basicData).not.toBeNull();
            expect(suggestData).not.toBeNull();
        });
    });

    // 币安数据测试
    describe('Binance Data Tests', () => {
        it('should return cryptocurrency data', async () => {
            const data = await getBinanceData('btc');
            expect(data).not.toBeNull();
        });
    });

    // 热力图测试
    describe('Thermal Map Tests', () => {
        it('should return market thermal maps', async () => {
            const result = await getFutuStockMap('cn', MapType.hy);
            expect(result).not.toBeNull();
        });
    });
});

// 工具函数测试
describe('Utility Tests', () => {
    describe('Amount Formatting', () => {
        it('should format various amounts correctly', () => {
            expect(formatAmount(1817000000)).toEqual('18.17亿');
            expect(formatAmount(1234567)).toEqual('123.46万');
            expect(formatAmount(1234)).toEqual('1234');
        });
    });

    describe('Command Parsing', () => {
        it('should handle valid commands', async () => {
            expect(await parseCommand('ss', () => { })).not.toBeNull();
            expect(await parseCommand('sd 300888', () => { })).not.toBeNull();
            expect(await parseCommand('re [庆祝]', () => { })).not.toBeNull();
            expect(await parseCommand('hot', () => { })).not.toBeNull();
        });

        it('should handle invalid commands', async () => {
            expect(await parseCommand('test', () => { })).toBeUndefined();
            expect(await parseCommand('sd', () => { })).toBeUndefined();
            expect(await parseCommand('wb 11', () => { })).toBeUndefined();
        });
    });
});

// 服务类测试
describe('Service Tests', () => {
    describe('AI Service', () => {
        it('should fetch AI data', async () => {
            let data = await getAIData('请依次给出下面 3 个问题的答案:\n(1) 昨天的当天是明天的什么？\n(2) 树上9只鸟，打掉1只，还剩几只？\n(3) 鲁迅为什么暴打周树人');
            expect(data).not.toBeNull();
        });
    });

    describe('Weibo Service', () => {
        it('should fetch Weibo data', async () => {
            const data = await getWeiboData();
            expect(data).not.toBeNull();
        });
    });

    describe('Holiday Service', () => {
        it('should return holiday information', async () => {
            expect(await holiday()).not.toBeNull();
        });
    });

    describe('Hot Spot Service', () => {
        it('should return market hot spots', async () => {
            const data = await getHotSpot();
            expect(data).not.toBeUndefined();
            expect(typeof data).toBe('string');
            expect(data.length).toBeGreaterThan(0);
        });
    });

    describe('Stock Summary Service', () => {
        it('should return market summary', async () => {
            const data = await getStockSummary();
            expect(data).not.toBeNull();
        });
    });
    describe('repeatMessage', () => {
        it('test', async () => {
            expect(await parseCommand('re [庆祝]', () => { })).not.toBeNull();
        });

    });
    describe('scn', () => {
        it('test', async () => {
            expect(await parseCommand('scn', (res) => {
                console.log(res);
                return res
            })).not.toBeNull();
        });
    })

    describe('sus', () => {
        it('test', async () => {
            expect(await parseCommand('sus', (res) => {
                console.log(res);
                return res
            })).not.toBeNull();
        });
    })

    describe('shk', () => {
        it('test', async () => {
            expect(await parseCommand('shk', (res) => {
                console.log(res);
                return res
            })).not.toBeNull();
        });
    })
});


describe('convertToNumber', () => {
    // 测试空值处理
    it('应该正确处理 null 和 undefined', () => {
        expect(convertToNumber(null)).toBe('');
        expect(convertToNumber(undefined)).toBe('');
    });

    // 测试正数截断
    it('应该正确截断正数小数位', () => {
        expect(convertToNumber(123.456)).toBe('123.45');  // 直接截断不四舍五入
        expect(convertToNumber(123.999)).toBe('123.99');  // 直接截断不四舍五入
        expect(convertToNumber(123)).toBe('123.00');
        expect(convertToNumber(0.1)).toBe('0.10');
    });

    // 测试负数截断
    it('应该正确截断负数小数位', () => {
        expect(convertToNumber(-123.456)).toBe('-123.45'); // 直接截断不四舍五入
        expect(convertToNumber(-123.999)).toBe('-123.99'); // 直接截断不四舍五入
        expect(convertToNumber(-123)).toBe('-123.00');
        expect(convertToNumber(-0.1)).toBe('-0.10');
    });

    // 测试零值
    it('应该正确处理零', () => {
        expect(convertToNumber(0)).toBe('0.00');
        expect(convertToNumber(-0)).toBe('0.00');
    });

    // 测试极小值截断
    it('应该正确截断极小值', () => {
        expect(convertToNumber(0.001)).toBe('0.00');
        expect(convertToNumber(0.999)).toBe('0.99');  // 直接截断不四舍五入
        expect(convertToNumber(-0.999)).toBe('-0.99'); // 直接截断不四舍五入
    });
});