import express from 'express'
import { WechatyBuilder, log } from 'wechaty'
import { onScan } from './listeners/onScan.ts'
import { onLogin } from './listeners/onLogin.ts'
import { onLogout } from './listeners/onLogout.ts'
import { onMessage } from './listeners/onMessage.ts'
import { onReady } from './listeners/onReady.ts'
import { sendContactMsg, sendRoomMsg } from './services/sendMessage.ts'
import { string2utf8 } from './utils/string2utf8.ts'
import { WechatferryPuppet } from '@wechatferry/puppet'


let bot = null
const CHROME_BIN = process.env.CHROME_BIN ?? {}
const runRobot = async () => {
  const puppet = new WechatferryPuppet()
  const bot = WechatyBuilder.build({
    name: 'wechat-bot',
    ...puppet
  })

  bot
    .on('scan', onScan)
    .on('login', onLogin)
    .on('ready', onReady)
    .on('logout', onLogout)
    .on('message', onMessage)

  await bot
    .start()
    .then(() => log.info('开始运行...'))
    .catch(e => log.error('StarterBot', e))
}
runRobot()

const app = express()
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/0', async (req, res) => {
  if (req.query.name || req.query.alias) {
    if (req.query.content) {
      const content = (req.query.content?.toString())
      const name = (req.query.name?.toString())
      const alias = (req.query.alias?.toString())
      await sendContactMsg(bot, content, alias, name)
      res.send('联系人消息成功')
    }
    else {
      res.send('缺少发送内容')
    }
  }
  else {
    res.send('缺少用户名/备注')
  }
})

app.get('/1', async (req, res) => {
  if (req.query.name) {
    if (req.query.content) {
      const content = string2utf8(req.query.content?.toString())
      const name = string2utf8(req.query.name?.toString())
      await sendRoomMsg(bot, content, name)
      res.send('群消息发送成功')
    }
    else {
      res.send('缺少发送内容')
    }
  }
  else {
    res.send('缺少群名')
  }
})
app.listen(3060)
