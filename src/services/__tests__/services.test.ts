import { describe, expect, it } from '@jest/globals';
import { getAIData } from '../acions/ai';
import { getWeiboData } from '../acions/weibo';
import { holiday } from '../acions/fishingTime';
import { getHotSpot } from '../acions/stockHotSpot';
import { getStockSummary } from '../acions/stockSummary';
import { parseCommand } from '../command';

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

    describe('Command Tests', () => {
        describe('repeatMessage', () => {
            it('should handle emoji repeat command', async () => {
                expect(await parseCommand('re [庆祝]', () => { })).not.toBeNull();
            });

            it('should handle text repeat command', async () => {
                expect(await parseCommand('re awsl', () => { })).not.toBeNull();
            });
        });

        describe('Market Commands', () => {
            it('should handle scn command', async () => {
                expect(await parseCommand('scn', (res) => {
                    console.log(res);
                    return res
                })).not.toBeNull();
            });

            it('should handle sus command', async () => {
                expect(await parseCommand('sus', (res) => {
                    console.log(res);
                    return res
                })).not.toBeNull();
            });

            it('should handle shk command', async () => {
                expect(await parseCommand('shk', (res) => {
                    console.log(res);
                    return res
                })).not.toBeNull();
            });
        });
    });
});