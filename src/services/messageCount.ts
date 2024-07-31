// 用json保存每个群里每个用户的发言内容

import MessageData from '../utils/messageData';
export const JSONPath = './message.json';

let messageData = null
export function messageCount(group: string, user: string){
    if(messageData){
        messageData = new MessageData(JSONPath)
    }
    messageData.saveMessage(group, user)
}