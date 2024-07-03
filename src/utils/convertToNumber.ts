import Decimal from 'decimal.js';

export function formatAmount(val: number): string {
    const decimalVal = new Decimal(val);

    if (decimalVal.gte(100000000)) {
        return `${decimalVal.div(100000000).toFixed(2)}亿`;
    } else if (decimalVal.gte(10000)) {
        return `${decimalVal.div(10000).toFixed(2)}万`;
    } else {
        return decimalVal.toFixed(0)
    }
}