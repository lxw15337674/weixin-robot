import fs from 'fs';
import { promises as fsPromises } from 'fs';
import lodash from 'lodash';

interface Message {
    [group: string]: {
        [user: string]: number;
    };
}

class MessageData {
    private path: string;
    private data: Message;
    private lastPersistedData: string = '';
    public debouncePersistMessageFn = lodash.debounce(() => this.persistMessage(), 2000);

    constructor(path: string) {
        this.path = path;
        this.data = {};
        this.initialize().catch(console.error);
    }

    public async initialize(): Promise<void> {
        await this.initJSON();
        this.data = await this.readJSON();
    }

    private async readJSON(): Promise<Message> {
        try {
            const data = await fsPromises.readFile(this.path, 'utf8');
            return JSON.parse(data) as Message;
        } catch (error) {
            console.error('读取文件时发生错误:', error);
            return {};
        }
    }

    private async initJSON(): Promise<void> {
        if (!fs.existsSync(this.path)) {
            const emptyJson: Message = {
                'group1': {
                    'user1': 0,
                    'user2': 0,
                },
                'group2': {
                    'user1': 0,
                },
            };
            const jsonContent = JSON.stringify(emptyJson, null, 2);
            try {
                await fsPromises.writeFile(this.path, jsonContent, 'utf8');
                console.log('空的JSON文件已成功创建');
            } catch (err) {
                console.error('创建文件时发生错误:', err);
            }
        }
    }

    public  saveMessage(group: string, user: string): void {
        if (!this.data[group]) {
            this.data[group] = {};
        }
        this.data[group][user] = (this.data[group][user] || 0) + 1;
    }

    public async persistMessage(): Promise<void> {
        const jsonContent = JSON.stringify(this.data, null, 2);
        if (jsonContent === this.lastPersistedData) {
            return; // 数据没有变化，不需要写入
        }
        try {
            await fsPromises.writeFile(this.path, jsonContent, 'utf8');
            this.lastPersistedData = jsonContent;
            console.log('JSON文件已成功写入');
        } catch (err) {
            console.error('写入文件时发生错误:', err);
        }
    }

    public getData(): Message {
        return this.data;
    }

    public async remove(): Promise<void> {
        if (!fs.existsSync(this.path)) {
            return;
        }
        try {
            await fsPromises.rm(this.path);
            console.log('文件已成功删除');
        } catch (err) {
            console.error('删除文件时发生错误:', err);
        }
    }
}

export default MessageData;