import express from 'express'
import { WechatyBuilder, log, ScanStatus } from 'wechaty'
import { onScan } from './listeners/onScan.ts'
import { onLogin } from './listeners/onLogin.ts'
import { onLogout } from './listeners/onLogout.ts'
import { onMessage } from './listeners/onMessage.ts'
import { onReady } from './listeners/onReady.ts'

// 将 bot 变量提升到全局作用域，以便其他路由可以访问
let bot: any

// 添加一个变量来存储最新的二维码
let lastQrCode: { qrcode: string; status: ScanStatus } | null = null

const runRobot = async () => {
  bot = WechatyBuilder.build({
    name: 'wechat-bot',
    // puppet: 'wechaty-puppet-wechat4u', // 如果有token，记得更换对应的puppet
    puppet: 'wechaty-puppet-wechat', // 如果 wechaty-puppet-wechat 存在问题，也可以尝试使用上面的 wechaty-puppet-wechat4u ，记得安装 wechaty-puppet-wechat4u
    puppetOptions: {
      uos: true,
    },
  })

  bot
    .on('scan', (qrcode, status) => {
      // 存储最新的二维码
      lastQrCode = { qrcode, status }
      // 继续执行原有的 onScan 处理
      onScan(qrcode, status)
    })
    .on('login', (user) => {
      // 登录成功后清除二维码
      lastQrCode = null
      onLogin(user)
    })
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

// 添加登录状态检查接口
app.get('/status', (req, res) => {
  if (!bot) {
    return res.json({ status: 'error', message: 'Bot not initialized' })
  }
  const loggedIn = bot.isLoggedIn
  const name = bot.name()
  res.json({
    status: 'success',
    data: {
      isLoggedIn: loggedIn,
      name: name,
    },
  })
})

// 添加登出接口
app.post('/logout', async (req, res) => {
  if (!bot) {
    return res.json({ status: 'error', message: 'Bot not initialized' })
  }
  
  try {
    await bot.logout()
    res.json({ status: 'success', message: '已登出' })
  } catch (error) {
    res.json({ status: 'error', message: '登出失败', error: error.message })
  }
})

// 添加重新启动接口
app.post('/restart', async (req, res) => {
  if (!bot) {
    return res.json({ status: 'error', message: 'Bot not initialized' })
  }

  try {
    await bot.stop()
    await bot.start()
    res.json({ status: 'success', message: '重启成功' })
  } catch (error) {
    res.json({ status: 'error', message: '重启失败', error: error.message })
  }
})

// 添加获取二维码接口
app.get('/qrcode', (req, res) => {
  if (!bot) {
    return res.json({ status: 'error', message: 'Bot not initialized' })
  }

  if (bot.isLoggedIn) {
    return res.json({ status: 'error', message: '机器人已经登录' })
  }

  if (!lastQrCode) {
    return res.json({ status: 'error', message: '二维码未就绪，请稍后再试' })
  }

  res.json({
    status: 'success',
    data: {
      qrcode: lastQrCode.qrcode,
      status: lastQrCode.status,
    },
  })
})

// 修改登录接口，已登录时返回提示而不是强制登出
app.post('/login', async (req, res) => {
  if (!bot) {
    return res.json({ status: 'error', message: 'Bot not initialized' })
  }

  try {
    // 如果已经登录，直接返回提示
    if (bot.isLoggedIn) {
      return res.json({ 
        status: 'error', 
        message: '机器人已经登录，如需重新登录请先调用登出接口' 
      })
    }
    
    // 重启 bot 以触发新的登录流程
    await bot.stop()
    await bot.start()
    
    res.json({ 
      status: 'success', 
      message: '已开始登录流程，请通过 /qrcode 接口获取二维码' 
    })
  } catch (error) {
    res.json({ 
      status: 'error', 
      message: '启动登录流程失败', 
      error: error.message 
    })
  }
})

// app.get('/0', async (req, res) => {
//   if (req.query.name || req.query.alias) {
//     if (req.query.content) {
//       const content = (req.query.content?.toString())
//       const name = (req.query.name?.toString())
//       const alias = (req.query.alias?.toString())
//       await sendContactMsg(bot, content, alias, name)
//       res.send('联系人消息成功')
//     }
//     else {
//       res.send('缺少发送内容')
//     }
//   }
//   else {
//     res.send('缺少用户名/备注')
//   }
// })

// app.get('/1', async (req, res) => {
//   if (req.query.name) {
//     if (req.query.content) {
//       const content = string2utf8(req.query.content?.toString())
//       const name = string2utf8(req.query.name?.toString())
//       await sendRoomMsg(bot, content, name)
//       res.send('群消息发送成功')
//     }
//     else {
//       res.send('缺少发送内容')
//     }
//   }
//   else {
//     res.send('缺少群名')
//   }
// })
app.listen(6060)
