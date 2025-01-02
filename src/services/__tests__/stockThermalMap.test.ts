import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { getFutuStockMap, getYuntuStockMap, MapType, Area } from '../acions/stockThermalMap';

describe('Stock Thermal Map Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getFutuStockMap', () => {
        it('应该正确获取富途股票热力图', async () => {
            const filePath = await getFutuStockMap(Area.cn, MapType.gu);
            expect(filePath).toMatch(/futu-cn-gu\.png$/);
        });

        it('应该使用缓存数据', async () => {
            await getFutuStockMap(Area.cn, MapType.gu);
            const secondCall = await getFutuStockMap(Area.cn, MapType.gu);
            expect(secondCall).toMatch(/futu-cn-gu\.png$/);
        });

        it('应该处理无效的地区参数', async () => {
            const filePath = await getFutuStockMap('invalid', MapType.gu);
            expect(filePath).toMatch(/futu-cn-gu\.png$/);
        });
    });

    describe('getYuntuStockMap', () => {
        it('应该正确获取云图行情', async () => {
            const filePath = await getYuntuStockMap();
            expect(filePath).toMatch(/yuntu\.png$/);
        });

        it('应该使用缓存数据', async () => {
            await getYuntuStockMap();
            const secondCall = await getYuntuStockMap();
            expect(secondCall).toBeDefined();
        });
    });
});
