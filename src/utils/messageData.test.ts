import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import MessageData from './messageData';

describe('MessageData', () => {
    let messageData: MessageData;
    const testPath = 'test.json';
    
    beforeAll(async () => {
         messageData = new MessageData(testPath);
    });

    afterAll(async () => {
        await messageData.remove();
    });

    it('保存消息并更新数据', async () => {
        await messageData.initialize();
        messageData.saveMessage('group1', '测试群', 'user1', '张三');
        messageData.saveMessage('group1', '测试群', 'user2', '李四');
        messageData.saveMessage('group2', '另一个群', 'user1', '张三');

        const data = messageData.getData();
        expect(data.length).toBe(2);
        expect(data[0].groupId).toBe('group1');
        expect(data[0].timeRanges[0].totalMessages).toBe(2);
        expect(data[0].timeRanges[0].userStats.length).toBe(2);
        expect(data[1].groupId).toBe('group2');
        expect(data[1].timeRanges[0].totalMessages).toBe(1);
    });

    // it('持久化消息到文件', async () => {
    //     await messageData.initialize();
    //     messageData.saveMessage('group1', '测试群', 'user1', '张三');
    //     await messageData.persistMessage();

    //     const expectedData = JSON.stringify([{
    //         groupId: 'group1',
    //         groupName: '测试群',
    //         lastUpdated: expect.any(String),
    //         timeRanges: [{
    //             date: expect.any(String),
    //             totalMessages: 1,
    //             userStats: [{
    //                 userId: 'user1',
    //                 username: '张三',
    //                 messageCount: 1,
    //                 lastMessageTime: expect.any(String)
    //             }]
    //         }]
    //     }], null, 2);

    //     expect(fsPromises.writeFile).toHaveBeenCalledWith(testPath, expectedData, 'utf8');
    // });

    // it('读取现有JSON文件', async () => {
    //     const mockData = [{
    //         groupId: 'group1',
    //         groupName: '测试群',
    //         lastUpdated: '2023-04-15T10:30:00Z',
    //         timeRanges: [{
    //             date: '2023-04-15',
    //             totalMessages: 1,
    //             userStats: [{
    //                 userId: 'user1',
    //                 username: '张三',
    //                 messageCount: 1,
    //                 lastMessageTime: '2023-04-15T10:30:00Z'
    //             }]
    //         }]
    //     }];

    //     (fs.existsSync as jest.Mock).mockReturnValue(true);
    //     (fsPromises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData) as never);

    //     await messageData.initialize();
    //     const data = messageData.getData();
    //     expect(data).toEqual(mockData);
    // });

    // it('删除文件', async () => {
    //     (fs.existsSync as jest.Mock).mockReturnValue(true);
    //     await messageData.remove();
    //     expect(fsPromises.rm).toHaveBeenCalledWith(testPath);
    // });
});