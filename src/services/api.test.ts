import { getStockData, getStockDetailData } from './stock';
import { getWeiboData } from './weibo';
import { getAIData } from './ai';
import { describe, expect, it, test } from '@jest/globals';
import { parseCommand } from './actions';
import { formatAmount } from '../utils/convertToNumber';

test(' test getWeiboData', async () => {
    const data = await getWeiboData();
    expect(data).not.toBeNull();
});




test('test error code query', async () => {
    const data = await getStockData('3008888');
    expect(data).not.toBeNull();
});

test('test getSuggestStock', async () => {
    const data = await getStockData('gzmt');
    expect(data).not.toBeNull();
})
describe('test getStockData', () => {
    it('should return stock data', async () => {
        const data = await getStockData('SH600519');
        expect(data).not.toBeNull();
    });
  
    it('test stock code query', async () => {
        const data = await getStockData('300888');
        expect(data).not.toBeNull();
    });

    // 测试美股盘前数据
    it('should return stock data', async () => {
        const data = await getStockData('tesla');
        expect(data).not.toBeNull();
    })
    // 测试港股盘前数据
    it('should return stock data', async () => {
        const data = await getStockData('tx');
        expect(data).not.toBeNull();
    })
})

test('test getAIData', async () => {
    const data = await getAIData('test');
    expect(data).not.toBeNull();
})



describe('test parseCommand', () => {
    it('should return null if command is not found', async () => {
        const data = await parseCommand('test');
        expect(data).toBeUndefined()
    });

    it('should return null if command is not found', async () => {
        const data = await parseCommand('sd');
        expect(data).toBeUndefined();
    });
    it('should return null if command is not found', async () => {
        const data = await parseCommand('s');
        expect(data).toBeUndefined();
    });
    it('should return detail stock data', async () => {
        const data = await parseCommand('sd ');
        expect(data).not.toBeNull();
    })
    it('should return stock data', async () => {
        const data = await parseCommand('s ');
        expect(data).not.toBeNull();
    })

})



describe('test formatAmount', () => {
    it('should format billions correctly', () => {
        const amount = 1817000000;
        const formattedAmount = formatAmount(amount);
        expect(formattedAmount).toEqual('18.17亿');
    });

    it('should format ten thousands correctly', () => {
        const amount = 1234567;
        const formattedAmount = formatAmount(amount);
        expect(formattedAmount).toEqual('123.46万');
    });


    it('should format thousands correctly', () => {
        const amount = 1234;
        const formattedAmount = formatAmount(amount);
        expect(formattedAmount).toEqual('1234');
    });
});