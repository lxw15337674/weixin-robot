import { describe, expect, it } from '@jest/globals';
import { PromiseQueue } from './PromiseQueue';

describe('PromiseQueue', () => {
    it('should execute tasks sequentially', async () => {
        const queue = new PromiseQueue();
        const executionOrder: number[] = [];

        const task1 = () => new Promise(resolve => {
            setTimeout(() => {
                executionOrder.push(1);
                console.log('task1')
                resolve(null);
            }, 100);
        });

        const task2 = () => new Promise(resolve => {
            executionOrder.push(2);
            console.log('task2')
            resolve(null);
        });

        const task3 = () => new Promise(resolve => {
            setTimeout(() => {
                executionOrder.push(3);
                console.log('task3')
                resolve(null);
            }, 50);
        });

        queue.addTask(task1);
        queue.addTask(task2);
        queue.addTask(task3);

        await new Promise<void>((resolve) => {
            const intervalId = setInterval(() => {
                if (queue.isEmpty()) {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 100); // 每 100ms 检查一次队列是否为空
        });

        expect(executionOrder).toEqual([1, 2, 3]);
    });

    it('should handle errors gracefully', async () => {
        const queue = new PromiseQueue();

        const task1 = () => Promise.reject(new Error('Task 1 failed'))
        const task2 = () => Promise.resolve('Task 2 success');

        queue.addTask(task1);
        queue.addTask(task2);

        // 等待足够长时间，确保两个任务都已执行
        await new Promise(resolve => setTimeout(resolve, 10000));

        // 任务 1 执行失败，任务 2 仍然应该执行
        expect(queue.isEmpty()).toBe(true);

    });
});