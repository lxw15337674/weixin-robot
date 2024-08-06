// 用json保存每个群里每个用户的发言内容

import MessageData from '../utils/messageData';
export const JSONPath = './message.json';

let messageData: MessageData = null
export function messageCount(groupId: string, groupName: string, userId: string, username: string): void {
    if (!messageData) {
        messageData = new MessageData(JSONPath)
    }
    messageData.saveMessage(groupId, groupName, userId, username)
    messageData.debouncePersistMessageFn();
}

export function generateGroupReport(groupId: string): string {
    if (!messageData) {
        messageData = new MessageData(JSONPath);
    }
    const group = messageData.getGroupData(groupId);
    if (!group) {
        return `未找到群组 ID ${groupId} 的数据。`;
    }

    const today = new Date().toISOString().split('T')[0];
    const todayRange = group.timeRanges.find(range => range.date === today);

    if (!todayRange) {
        return `今天还没有人发言哦~`;
    }

    let totalMessages = todayRange.totalMessages;

    // 对用户按消息数排序
    const sortedUsers = todayRange.userStats
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 5);

    // 生成报告文本
    let report = `🎉 群聊小报告 - "${group.groupName}" 的热闹现场 🎉,📊 总计发言量：${totalMessages} 条\n`
    report += `🏆 今日话唠排行榜 TOP 5 🏆`;
    sortedUsers.forEach((user, index) => {
        let emoji = ['🥇', '🥈', '🥉', '🏅', '🎖️'][index];
        report += `\n${emoji} ${user.username} : ${user.messageCount} 条`;
    });
    return report;
}