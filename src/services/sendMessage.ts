import { log } from 'wechaty'
import type { Wechaty } from 'wechaty'
import { PromiseQueue } from '../utils/PromiseQueue';
import { randomSleep } from '../utils/sleep';
import { FileBox } from 'file-box'

const queue = new PromiseQueue()


export async function sendContactMsg(bot: Wechaty, content: string, alias?: string, name?: string) {
  let query: Record<string, string> = {}
  if (alias)
    query = { alias }
  else if (name)
    query = { name }
  queue.addTask(async () => {
    try {
      const contact = await bot.Contact.find(query)
      await randomSleep(1000, 3000);
      if (contact)
        await contact.say(content)
    }
    catch (error) {
      log.error('发送联系人信息错误')
    }
  })
}

export async function sendRoomMsg(bot: Wechaty, content: string, topic: string) {
  const query: Record<string, string> = {
    topic,
  }
  queue.addTask(async () => {
    try {
      const room = await bot.Room.find(query)
      await randomSleep(1000, 3000);
      if (room)
        await room.say(content)
    }
    catch (error) {
      log.error('发送群信息错误')
    }
  })
}
// 发送图片给联系人
export async function sendContactImage(bot: Wechaty, imagePath: string, alias?: string, name?: string) {
  let query: Record<string, string> = {}
  if (alias)
    query = { alias }
  else if (name)
    query = { name }
  queue.addTask(async () => {
    try {
      const contact = await bot.Contact.find(query)
      await randomSleep(1000, 3000);
      if (contact) {
        const fileBox = FileBox.fromFile(imagePath)
        await contact.say(fileBox);
      }
    }
    catch (error) {
      log.error('发送联系人图片错误', error);
    }
  })
}

// 发送图片给群组
export async function sendRoomImage(bot: Wechaty, imagePath: string, topic: string) {
  const query: Record<string, string> = {
    topic,
  }
  queue.addTask(async () => {
    try {
      const room = await bot.Room.find(query)
      await randomSleep(1000, 3000);
      if (room) {
        const fileBox = FileBox.fromFile(imagePath)
        await room.say(fileBox);
      }
    }
    catch (error) {
      log.error('发送群组图片错误', error);
    }
  })
}