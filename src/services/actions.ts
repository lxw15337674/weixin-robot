import { getAIData } from './ai'
import { getBinanceData } from './binance'
import { holiday } from './fishingTime'
import { getFutureData } from './future'
import { getHotSpot } from './stockHotSpot'
import { getSHStockData, getStockData, getStockDetailData } from './stockInfo'
import { getFutuStockMap, getYuntuStockMap } from './stockThermalMap'
import { getWeiboData } from './weibo'

const commandMap = [
  {
    key: 'a ',
    callback: getAIData,
    msg: 'a [问题] 或 艾特机器人[问题]  - 向国产AI提问 例如: a 鲁迅与周树人的关系是什么？',
    // 是否存在参数
    hasArgs: true,
  },
  // {
  //   key: 'mc',
  //   callback: generateGroupReport,
  //   msg: 'mc - 获取今日群聊发言排名',
  //   hasArgs: false,
  //   // 是否开启功能
  //   enable: process.env.GROUP_STATISTICS
  // },
  {
    key:'hot',
    callback: getHotSpot,
    msg: 'hot - 获取今日热点概念',
    hasArgs: false,
  },
  {
    key: 'ss',
    callback: () => getSHStockData(),
    msg: 'ss - 获取上证指数信息',
    hasArgs: false,
  },
  {
    key: 'sd ',
    callback: getStockDetailData,
    msg: 'sd [股票代码] - 获取股票详细信息 例如: sd gzmt',
    hasArgs: true,
  },
  {
    key: 's ',
    callback: getStockData,
    msg: 's [股票代码] - 获取股票信息 例如: s gzmt',
    hasArgs: true,
  },
  {
    key: 'f ',
    callback: getFutureData,
    msg: 'f [期货代码] - 获取期货信息 例如: f XAU',
    hasArgs: true,
  },
  {
    key: 'dp',
    callback: () => getYuntuStockMap(),
    msg: 'dp(dapan) - 获取大盘热力图',
  },
  {
    key: 'mcn',
    callback: (symbol) => getFutuStockMap('cn', symbol),
    msg: 'mcn - 获取富途中国股票市场热力图, 可选参数: [hy|gu] 例如: mcn hy 獲取行業熱力圖，mcn gu 獲取個股熱力圖',
    hasArgs: true,
  },
  {
    key: 'mhk',
    callback: (symbol) => getFutuStockMap('hk', symbol),
    msg: 'mhk - 获取富途香港股市场热力图, 可选参数: [hy|gu] 例如: mhk hy 獲取行業熱力圖，mhk gu 獲取個股熱力圖',
  },
  {
    key: 'mus',
    callback: (symbol) => getFutuStockMap('us', symbol),
    msg: 'mus - 获取富途美股市场热力图, 可选参数: [hy|gu] 例如: mus hy 獲取行業熱力圖，mus gu 獲取個股熱力圖',
  },
  {
    key: 'b ',
    callback: getBinanceData,
    msg: 'b [货币代码] - 获取数字货币信息 例如: b btc',
    hasArgs: true,
  },
  {
    key: 'wb',
    callback: getWeiboData,
    msg: 'wb - 获取微博热搜',
    hasArgs: false,
  },
  {
    key: 'hy',
    callback: holiday,
    msg: 'hy - 获取节假日信息',
    hasArgs: false,
  },
  {
    key: 'hp',
    callback: getHelp,
    msg: 'hp - 获取命令帮助',
    hasArgs: false,
  },
];
// 解析命令
export function parseCommand(msg: string, roomId?: string): Promise<string> {
  for (const command of commandMap) {
    if (command.hasArgs) {
      if (msg.startsWith(command.key)) {
        // 解析后面的参数
        const args = msg.slice(command.key.length).trim()
        return command.callback(args)
      }
    } else {
      if (msg === command.key) {
        return command.callback(roomId)
      }
    }
  }
}

export function getHelp() {
  const commandMsg = commandMap.filter(command => command.enable !== true).map(command => command.msg).join('\n')
  return `命令列表：\n${commandMsg}\n项目地址：https://github.com/lxw15337674/weixin-robot`
}
