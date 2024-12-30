export const randomSleep = (min: number, max: number) => {
    const sleepTime = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, sleepTime));
}
export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}