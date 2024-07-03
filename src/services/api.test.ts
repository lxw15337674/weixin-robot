import { getStockData, getStockDetailData } from './stock';
import { getWeiboData } from './weibo';
import { getAIData } from './ai';
import { expect, test } from '@jest/globals';

test(' test getWeiboData', async () => {
    const data = await getWeiboData();
    expect(data).not.toBeNull();
});


test('test stock query', async () => {
    const data = await getStockData('SH600519');
    expect(data).not.toBeNull();
});

test('test stock code query', async () => {
    const data = await getStockData('300888');
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

test('test getAIData', async () => {
    const data = await getAIData('test');
    expect(data).not.toBeNull();
})

test('test getStockDetailData', async () => {
    const data = await getStockDetailData('SH600519');
    expect(data).not.toBeNull();
})