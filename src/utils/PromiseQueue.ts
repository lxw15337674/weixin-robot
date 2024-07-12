const randomSleep = (min: number, max: number) => {
    const sleepTime = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, sleepTime));
}

export class PromiseQueue {
    private queue: (() => Promise<any>)[] = [];
    private isRunning: boolean = false;

    /**
     * 添加任务到队列
     * @param task 返回 Promise 的任务函数
     */
    addTask(task: () => Promise<any>): void {
        this.queue.push(task);
        this.run();
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    /**
     * 运行队列
     */
    private async run(): Promise<void> {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        await randomSleep(3000, 10000);

        while (this.queue.length > 0) {
            const task = this.queue[0]
            try {
                await task(); // 执行任务并等待其完成
                await randomSleep(3000, 10000);
                this.queue.shift(); // 从队列中移除已完成的任务
            } catch (error) {
                console.error("任务执行出错:", error);
                // 处理错误，例如记录日志或抛出异常
            }
        }

        this.isRunning = false;
    }
}