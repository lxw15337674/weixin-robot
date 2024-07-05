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
    msg: '向国产AI提问: "[a 问题]" 或 "艾特机器人[问题]"  例如: "a 鲁迅与周树人的关系是什么？"',
  },
  {
    key: 'ss',
    callback: () => getStockData('SH000001'),
    msg: '获取获取上证指数信息: "ss"',
  },
  {
    key: 'sd ',
    callback: getStockDetailData,
    msg: '获取股票详细信息: "sd [股票代码]" 例如: "sd gzmt"',
  },
  {
    key: 's ',
    callback: getStockData,
    msg: '获取股票信息: "s [股票代码]" 例如: "s gzmt"',
  },
  {
    key: 'f ',
    callback: getFutureData,
    msg: '获取期货信息: "f [期货代码]" 例如: "f XAU"',
  },
  {
    key: 'b',
    callback: getBinanceData,
    msg: '获取数字货币信息: "b [货币代码]" 例如: "b btc"',
  },
  {
    key: 'wb',
    callback: getWeiboData,
    msg: '获取微博热搜: "wb"',
  },
  {
    key: 'hy',
    callback: holiday,
    msg: '获取节假日信息: "hy"',
  },
  {
    key: 'hp',
    callback: getHelp,
    msg: '获取命令帮助: "hp"',
  },
];

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
  return `命令列表：\n${commandMsg}\n项目地址：https://github.com/lxw15337674/weixin-robot`
}
