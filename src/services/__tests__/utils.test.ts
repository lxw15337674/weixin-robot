import { describe, expect, it } from '@jest/globals';
import { parseCommand } from '../command';
import { convertToNumber, formatAmount } from '../../utils/convertToNumber';

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