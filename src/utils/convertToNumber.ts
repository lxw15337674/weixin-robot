import Decimal from 'decimal.js';

// 格式化金额，使用Decimal处理精度
export const formatAmount = (num: number) => {
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

// 保留两位小数
export const convertToNumber = (num: number) => {
    return new Decimal(num).toDecimalPlaces(2).toNumber();
};