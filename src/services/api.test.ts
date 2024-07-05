import { getStockData } from './stock';
import { getWeiboData } from './weibo';
import { getAIData } from './ai';
import { describe, expect, it, test } from '@jest/globals';
import { parseCommand } from './actions';
import { formatAmount } from '../utils/convertToNumber';
import { holiday } from './fishingTime';

describe('getWeiboData', () => {
    it('should fetch Weibo data', async () => {
        const data = await getWeiboData();
        expect(data).not.toBeNull();
    });
});

describe('getStockData', () => {
    it('should return stock data for a valid A-share code', async () => {
        const data = await getStockData('SH600519');
        expect(data).not.toBeNull();
    });

    it('should return stock data for a valid A-share code without prefix', async () => {
        const data = await getStockData('300888');
        expect(data).not.toBeNull();
    });

    it('should return stock data for a valid stock symbol', async () => {
        const data = await getStockData('gzmt');
        expect(data).not.toBeNull();
    });

    it('should handle invalid stock codes gracefully', async () => {
        const data = await getStockData('3008888');
        expect(data).not.toBeNull(); // Assuming an error message is returned
    });

    it('should return pre-market data for US stocks', async () => {
        const data = await getStockData('tesla');
        expect(data).not.toBeNull();
    });

    it('should return pre-market data for Hong Kong stocks', async () => {
        const data = await getStockData('tx');
        expect(data).not.toBeNull();
    });

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
    });

    it('should return data for valid commands', async () => {
        expect(await parseCommand('ss')).not.toBeNull();
        expect(await parseCommand('sd ')).not.toBeNull();
        expect(await parseCommand('s ')).not.toBeNull();
        expect(await parseCommand('hy')).not.toBeNull();
    });
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