import { getAIData } from './ai'
import { getStockData, getStockDetailData } from './stock'
import { getWeiboData } from './weibo'

const commandMap = [
  {
    key: 'wb',
    callback: getWeiboData,
    msg: 'wb 获取当日微博热搜',
  },
  {
    key: 'sd ',
    callback: getStockDetailData,
    msg: 'sd 股票代码(注意有空格) 获取股票详细数据 例如 sd gzmt',
  },
  {
    key: 'ss',
    callback: () => getStockData('SH000001'),
    msg: 'ss 获取上证指数'
  },
  {
    key: 's ',
    callback: getStockData,
    msg: 's 股票代码(注意有空格) 获取股票信息 例如 s gzmt',
  },
  {
    key: 'a ',
    callback: getAIData,
    msg: 'a (注意有空格)或艾特坤哥，向坤哥提问 例如 a 鲁迅与周树人的关系是什么？',
  },
  {
    key: 'hp',
    callback: getHelp,
    msg: 'hp 获取命令帮助',
  },
]

// 解析命令
export function parseCommand(msg: string): Promise<string> {
  for (const command of commandMap) {
    if (msg.startsWith(command.key)) {
      // 解析后面的参数
      const args = msg.slice(command.key.length).trim()
      return command.callback(args)
    }
  }
}

export function getHelp() {
  const commandMsg = commandMap.map(command => command.msg).join('\n')
  return `命令列表：\n${commandMsg}\n 项目地址：https://github.com/lxw15337674/weixin-robot`
}
