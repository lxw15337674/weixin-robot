import { afterAll, describe, expect, it } from '@jest/globals';
import MessageData from './messageData';

describe('test messageData', () => {
    const path = './test.json';
    const messageData = new MessageData(path);
    afterAll(async () => {
        await messageData.remove();
    })
    // it('should create json', async () => {
    //     expect(messageData.getData()).not.toBeNull()
    // });
    it('should save message', async () => {
        messageData.saveMessage('group1', 'user1');
        messageData.saveMessage('group1', 'user1');
        messageData.saveMessage('group1', 'user2');
        messageData.saveMessage('group2', 'user1');
        messageData.saveMessage('group2', 'user1');
        messageData.saveMessage('group2', 'user2');
        expect(messageData.getData()).toEqual(
            {
                "group1": {
                    "user1": 2,
                    "user2": 1
                },
                "group2": {
                    "user1": 2,
                    "user2": 1
                }
            }
        )
        messageData.debouncePersistMessageFn()
    });
});