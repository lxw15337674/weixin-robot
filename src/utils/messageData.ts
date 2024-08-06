import fs from 'fs';
import { promises as fsPromises } from 'fs';
import lodash from 'lodash';

interface UserStat {
    userId: string;
    username: string;
    messageCount: number;
    lastMessageTime: string;
}

interface TimeRange {
    date: string;
    totalMessages: number;
    userStats: UserStat[];
}

interface GroupData {
    groupId: string;
    groupName: string;
    lastUpdated: string;
    timeRanges: TimeRange[];
}

class MessageData {
    private path: string;
    private data: GroupData[];
    private lastPersistedData: string = '';
    public debouncePersistMessageFn = lodash.debounce(() => this.persistMessage(), 2000);

    constructor(path: string) {
        this.path = path;
        this.data = [];
        this.initialize()
    }

    public async initialize(): Promise<void> {
        await this.initJSON();
        this.data = await this.readJSON();
    }

    private async readJSON(): Promise<GroupData[]> {
        try {
            const data = await fsPromises.readFile(this.path, 'utf8');
            return JSON.parse(data) as GroupData[];
        } catch (error) {
            console.error('读取文件时发生错误:', error);
            return [];
        }
    }

    private async initJSON(): Promise<void> {
        if (!fs.existsSync(this.path)) {
            const emptyJson: GroupData[] = [];
            const jsonContent = JSON.stringify(emptyJson, null, 2);
            try {
                await fsPromises.writeFile(this.path, jsonContent, 'utf8');
            } catch (err) {
                console.error('创建文件时发生错误:', err);
            }
        }
    }

    public saveMessage(groupId: string, groupName: string, userId: string, username: string): void {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        let group = this.data.find(g => g.groupId === groupId);
        if (!group) {
            group = {
                groupId,
                groupName,
                lastUpdated: now.toISOString(),
                timeRanges: []
            };
            this.data.push(group);
        }

        group.lastUpdated = now.toISOString();

        let todayRange = group.timeRanges.find(range => range.date === today);
        if (!todayRange) {
            todayRange = {
                date: today,
                totalMessages: 0,
                userStats: []
            };
            group.timeRanges.push(todayRange);
        }

        todayRange.totalMessages++;

        let userStat = todayRange.userStats.find(stat => stat.userId === userId);
        if (!userStat) {
            userStat = {
                userId,
                username,
                messageCount: 0,
                lastMessageTime: now.toISOString()
            };
            todayRange.userStats.push(userStat);
        }

        userStat.messageCount++;
        userStat.lastMessageTime = now.toISOString();

        console.log(`已记录群【${groupName}】用户【${username}】的发言次数: ${userStat.messageCount}`);
    }

    public async persistMessage(): Promise<void> {
        const jsonContent = JSON.stringify(this.data, null, 2);
        if (jsonContent === this.lastPersistedData) {
            return; // 数据没有变化，不需要写入
        }
        try {
            await fsPromises.writeFile(this.path, jsonContent, 'utf8');
            this.lastPersistedData = jsonContent;
            // console.log('JSON文件已成功写入');
        } catch (err) {
            console.error('写入文件时发生错误:', err);
        }
    }

    public getData(): GroupData[] {
        return this.data;
    }

    public getGroupData(groupId: string): GroupData {
        return this.data.find(g => g.groupId === groupId);
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