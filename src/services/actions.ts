import { getAIData } from './ai'
import { getBinanceData } from './binance'
import { holiday } from './fishingTime'
import { getFutureData } from './future'
import { getStockData, getStockDetailData } from './stock'
import { getWeiboData } from './weibo'

const commandMap = [
  {
    key: 'a ',
    callback: getAIData,
    msg: 'a 或艾特坤哥，向坤哥提问 例如:a 鲁迅与周树人的关系是什么？',
  },
  {
    key: 'ss',
    callback: () => getStockData('SH000001'),
    msg: 'ss 获取上证指数'
  },
  {
    key: 'sd ',
    callback: getStockDetailData,
    msg: 'sd 股票代码 获取股票详细数据 例如:sd gzmt',
  },
  {
    key: 's ',
    callback: getStockData,
    msg: 's 股票代码 获取股票信息 例如:s gzmt',
  },
  {
    key: 'f ',
    callback: getFutureData,
    msg: 'f 期货代码 获取期货信息 例如:f XAU'
  },
  {
    key: 'b',
    callback: getBinanceData,
    msg: 'b 获取数字货币信息 例如:b btc'
  },

  {
    key: 'wb',
    callback: getWeiboData,
    msg: 'wb 获取当日微博热搜',
  },
  {
    key: 'hy',
    callback: holiday,
    msg: 'hy 获取节假日信息'
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
