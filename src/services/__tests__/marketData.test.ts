import { getStockData } from '../acions/stockInfo';
import { getFutureData, getFutureSuggest } from '../acions/future';
import { getBinanceData } from '../acions/binance';
import { getFutuStockMap, MapType } from '../acions/stockThermalMap';
import { describe, expect, it } from '@jest/globals';

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