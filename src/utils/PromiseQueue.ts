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
        if (this.isRunning || this.queue.length === 0) {
            return;
        }

        this.isRunning = true;

        while (this.queue.length > 0) {
            const task = this.queue[0]
            try {
                await task(); // 执行任务并等待其完成
                // 随机延时 1-4 秒
                const randomDelay = Math.floor(Math.random() * 4 + 1) * 1000;
                await new Promise((resolve) => setTimeout(resolve, randomDelay));
                this.queue.shift(); // 从队列中移除已完成的任务
            } catch (error) {
                console.error("任务执行出错:", error);
                // 处理错误，例如记录日志或抛出异常
            }
        }

        this.isRunning = false;
    }
}