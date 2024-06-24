import { getStockData } from './stock';
import { getWeiboData } from './weibo';
import { expect, test } from '@jest/globals';

test(' test getWeiboData', async () => {
    const data = await getWeiboData();
    expect(data).not.toBeNull();
 });


test('test stock query', async () => {
    const data = await getStockData('SH600519');
    expect(data).not.toBeNull();
});



test('test getSuggestStock', async () => {
    const data = await getStockData('gzmt');
    expect(data).not.toBeNull();
})