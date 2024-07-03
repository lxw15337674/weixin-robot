import { getAIData } from './ai'
import { getStockData } from './stock'
import { getWeiboData } from './weibo'

const commandMap = [
  {
    key: '-wb',
    callback: getWeiboData,
    msg: '-wb 获取当日微博热搜',
  },
  {
    key: '-s',
    callback: getStockData,
    msg: '-s 股票代码 获取股票信息 例如 -s gzmt 获取贵州茅台股票信息',
  },
  {
    key:'-sd',
    callback: getStockData,
    msg: '-sd 股票代码 获取股票详细数据 例如 -sd gzmt 获取贵州茅台股票详细数据',
  },
  {
    key: '-a',
    callback: getAIData,
    msg: '-a 或艾特坤哥，向坤哥提问 例如 -a 鲁迅与周树人的关系是什么？',
  },
  {
    key: '-h',
    callback: getHelp,
    msg: '-h 获取命令帮助',
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
