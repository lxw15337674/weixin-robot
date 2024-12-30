import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { getFutuStockMap, getYuntuStockMap, MapType, Area } from '../stockThermalMap';
import { saveBufferToImage } from '../../utils/save';

describe('Stock Thermal Map Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getFutuStockMap', () => {
        it('应该正确获取富途股票热力图', async () => {
            const buffer = await getFutuStockMap(Area.cn, MapType.gu);
            saveBufferToImage(buffer, 'futu-cn-gu.png');
            expect(buffer).toBeDefined();
        });

        it('应该使用缓存数据', async () => {
            await getFutuStockMap(Area.cn, MapType.gu);
            const secondCall = await getFutuStockMap(Area.cn, MapType.gu);
            expect(secondCall).toBeDefined();
        });

        it('应该处理无效的地区参数', async () => {
            const buffer = await getFutuStockMap('invalid' as Area, MapType.gu);
            expect(buffer).toBeDefined();
        });
    });

    describe('getYuntuStockMap', () => {
        it('应该正确获取云图行情', async () => {
            const buffer = await getYuntuStockMap();
            saveBufferToImage(buffer, 'yuntu.png');
            expect(buffer).toBeDefined();
        });

        it('应该使用缓存数据', async () => {
            await getYuntuStockMap();
            const secondCall = await getYuntuStockMap();
            expect(secondCall).toBeDefined();
        });
    });
});
