import Decimal from 'decimal.js';

// 格式化金额，使用Decimal处理精度
export const formatAmount = (num?: number | null) => {
    if (num === null || num === undefined) {
        return '';
    }
    const isNegative = num < 0;
    const absNum = Math.abs(num);

    let result = '';
    if (absNum >= 100000000) { // 亿
        result = new Decimal(absNum).dividedBy(100000000).toDecimalPlaces(2).toString() + '亿';
    } else if (absNum >= 10000) { // 万
        result = new Decimal(absNum).dividedBy(10000).toDecimalPlaces(2).toString() + '万';
    } else {
        result = new Decimal(absNum).toDecimalPlaces(2).toString();
    }

    return isNegative ? '-' + result : result;
};

// 保留两位小数并处理正负号

export const convertToNumber = (num?: number | null): string => {
    if (num === null || num === undefined) {
        return '';
    }

    // 使用 Decimal 处理数字
    const decimalNum = new Decimal(num);

    // 保留两位小数，截断而不是四舍五入
    const truncated = decimalNum.toDecimalPlaces(2, Decimal.ROUND_DOWN);

    // 处理负零的情况
    if (truncated.isZero()) {
        return '0.00';
    }

    // 处理负号
    const isNegative = truncated.isNegative();
    const absoluteValue = truncated.abs();

    // 转换为字符串并确保两位小数
    const [integerPart, decimalPart = '00'] = absoluteValue.toString().split('.');

    // 补全小数部分
    const paddedDecimalPart = decimalPart.padEnd(2, '0');

    // 拼接结果
    return `${isNegative ? '-' : ''}${integerPart}.${paddedDecimalPart}`;
};