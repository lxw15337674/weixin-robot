import { log } from 'wechaty'
import type { Message, Room } from 'wechaty'
import { sendContactImage, sendContactMsg, sendRoomImage, sendRoomMsg } from '../services/sendMessage.ts'
import { parseCommand } from '../services/command.ts'
import { getAIData } from '../services/acions/ai.ts'
import { messageCount } from '../services/acions/messageCount.ts'

export const GroupStatistics = process.env.GROUP_STATISTICS ?? false

const startTime = new Date()
export async function onMessage(msg: Message) {
  // 屏蔽接收历史消息,允许1分钟内的消息
  if (msg.date().getTime() < startTime.getTime() - 1 * 60 * 1000) {
    return
  }
  const room = msg.room()
  if (room) {
    // const topic = await room.topic()
    // 群白名单，只接受白名单内的群消息
    // if (!robotConfig.whiteRoomList.includes(topic))
    //   return
    // 群消息
    getMessagePayload(msg, room)
  }
  else {
    const bot = msg.wechaty
    const contact = msg.talker()
    if (contact.type() === bot.Contact.Type.Official || contact.id === 'weixin')
      return

    // 私聊信息
    getMessagePayload(msg)
  }
}

async function getMessagePayload(msg: Message, room?: Room) {
  const bot = msg.wechaty

  if (msg.self()) {
    return
  }
  if (room) {
    dispatchRoomTextMsg(msg, room)
  } else {
    dispatchFriendTextMsg(msg)
  }
  // switch (msg.type()) {
  //   case bot.Message.Type.Text: {
  //     room ? dispatchRoomTextMsg(msg, room) : dispatchFriendTextMsg(msg)
  //     break
  //   }
  // case bot.Message.Type.Attachment:
  // case bot.Message.Type.Audio: {
  //   room ? dispatchRoomAudioMsg(msg, room) : dispatchFriendAudioMsg(msg)
  //   break
  // }
  // case bot.Message.Type.Video: {
  //   room ? dispatchRoomVideoMsg(msg, room) : dispatchFriendVideoMsg(msg)
  //   break
  // }
  // case bot.Message.Type.Emoticon: {
  //   room ? dispatchRoomEmoticonMsg(msg, room) : dispatchFriendEmoticonMsg(msg)
  //   break
  // }
  // case bot.Message.Type.Image: {
  //   room ? dispatchRoomImageMsg(msg, room) : dispatchFriendImageMsg(msg)
  //   break
  // }
  // case bot.Message.Type.Url: {
  //   room ? dispatchRoomUrlMsg(msg, room) : dispatchFriendUrlMsg(msg)
  //   break
  // }
  // case bot.Message.Type.MiniProgram: {
  //   room ? dispatchRoomMiniProgramMsg(msg, room) : dispatchFriendMiniProgramMsg(msg)
  //   break
  // }
  // `  default:
  //     // log.info('接收到莫名其妙的消息')
  //     break
  // }`
}

/**
 * 群文本消息
 * @param msg
 * @param room
 */
async function dispatchRoomTextMsg(msg: Message, room: Room) {
  const topic = await room.topic()
  const content = msg?.text()?.trim() ?? ''
  const contact = msg.talker()
  const alias = await contact.alias()
  const bot = msg.wechaty
  const name = alias ? `${contact.name()}(${alias})` : contact.name()

  // log.info(`群【${topic}】【${name}】 发送了：${content}`)

  // 记录群消息
  if (GroupStatistics) {
    messageCount(room.id, topic, contact.id, name)
  }

  // 判断是否在群聊中被 @
  if (await msg.mentionSelf()) {
    const response = await getAIData(content);
    if (typeof response === 'string') {
      log.info(`根据@消息【${content}】返回消息：${response}`);
      await sendRoomMsg(bot, response, topic);
    }
    return;
  }

  const sendMessage = async (content: string) => {
    if (!content) {
      return
    }
    if (isFileExtension(content)) {
      log.info(`根据命令【${content}】返回文件`);
      await sendRoomImage(bot, content, topic);
      return;
    }
    if (typeof content === 'string') {
      log.info(`根据命令【${content}】返回消息：${content}`);
      await sendRoomMsg(bot, content, topic);
      return;
    }
    log.warn(`未知的响应类型: ${typeof content}`);
  }
  parseCommand(content, sendMessage, room.id);
}

/**
 * 好友文本消息
 * @param msg
 */
async function dispatchFriendTextMsg(msg: Message) {
  const bot = msg.wechaty;
  const content = msg.text().trim();
  const contact = msg.talker();
  const alias = await contact.alias();
  const name = alias ? `${contact.name()}(${alias})` : contact.name();
  // log.info(`好友【${name}】 发送了：${content}`);
  const sendMessage = async (content: string) => {
    if (!content) {
      return
    }
    if (isFileExtension(content)) {
      log.info(`根据命令【${content}】返回文件`);
      await sendContactImage(bot, content, alias, name);
      return;
    }
    if (typeof content === 'string') {
      log.info(`根据命令【${content}】返回消息：${content}`);
      await sendContactMsg(bot, content, alias, name);
      return;
    }
    log.warn(`未知的响应类型: ${typeof content}`);
  }
  parseCommand(content, sendMessage);
}

function isFileExtension(content: string): boolean {
  const fileExtensions = [
    // 图片
    '.png', '.jpg', '.jpeg', '.webp', '.gif',
    // 文档
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt',
    // 音视频
    '.mp3', '.mp4', '.wav','mov',
    // 压缩文件
    '.zip', '.rar', '.7z'
  ]
  return fileExtensions.some(ext => content.toLowerCase().endsWith(ext))
}

// async function dispatchRoomEmoticonMsg(msg: Message, room: Room) {
//   const topic = await room.topic()
//   const contact = msg.talker()
//   const alias = await contact.alias()

//   const name = alias ? `${contact.name()}(${alias})` : contact.name()
//   log.info(`群【${topic}】【${name}】 发送了表情符号`)
// }

// async function dispatchFriendEmoticonMsg(msg: Message) {
//   const contact = msg.talker()
//   const alias = await contact.alias()

//   const name = alias ? `${contact.name()}(${alias})` : contact.name()
//   log.info(`好友【${name}】 发送了表情符号`)
// }

// async function dispatchRoomImageMsg(msg: Message, room: Room) {
//   const topic = await room.topic()
//   const contact = msg.talker()
//   const alias = await contact.alias()
//   const name = alias ? `${contact.name()}(${alias})` : contact.name()
//   log.info(`群【${topic}】【${name}】 发送了图片`)
// }

// async function dispatchFriendImageMsg(msg: Message) {
//   const contact = msg.talker()
//   const alias = await contact.alias()

//   const name = alias ? `${contact.name()}(${alias})` : contact.name()
//   log.info(`好友【${name}】 发送了图片`)
// }

// async function dispatchRoomUrlMsg(msg: Message, room: Room) {
//   const topic = await room.topic()
//   const contact = msg.talker()
//   const alias = await contact.alias()
//   const name = alias ? `${contact.name()}(${alias})` : contact.name()
//   log.info(`群【${topic}】【${name}】 发送了链接`)
// }

// async function dispatchFriendUrlMsg(msg: Message) {
//   const contact = msg.talker()
//   const alias = await contact.alias()

//   const name = alias ? `${contact.name()}(${alias})` : contact.name()
//   log.info(`好友【${name}】 发送了链接`)
// }

// async function dispatchRoomMiniProgramMsg(msg: Message, room: Room) {
//   const topic = await room.topic()
//   const contact = msg.talker()
//   const alias = await contact.alias()
//   const name = alias ? `${contact.name()}(${alias})` : contact.name()
//   log.info(`群【${topic}】【${name}】 发送了小程序`)
// }

// async function dispatchFriendMiniProgramMsg(msg: Message) {
//   const contact = msg.talker()
//   const alias = await contact.alias()

//   const name = alias ? `${contact.name()}(${alias})` : contact.name()
//   log.info(`好友【${name}】 发送了小程序`)
// }
