import { getAIData } from './ai'
import { getBinanceData } from './binance'
import { holiday } from './fishingTime'
import { getFutureData } from './future'
import { getHotSpot } from './stockHotSpot'
import { getSHStockData, getStockData, getStockDetailData } from './stockInfo'
import { getStockSummary } from './stockSummary'
import { getFutuStockMap, getYuntuStockMap } from './stockThermalMap'
import { getWeiboData } from './weibo'

const commandMap = [
  // 股市相关命令
  {
    key: 'ss',
    callback: () => getSHStockData(),
    msg: 'ss - 获取上证指数信息',
    hasArgs: false,
  },
  {
    key: 's ',
    callback: getStockData,
    msg: 's [股票代码] - 获取股票信息 例如: s gzmt',
    hasArgs: true,
  },
  {
    key: 'sd ',
    callback: getStockDetailData,
    msg: 'sd [股票代码] - 获取股票详细信息 例如: sd gzmt',
    hasArgs: true,
  },
  {
    key: 'dp',
    callback: () => getStockSummary(),
    msg: 'dp - 获取大盘市场信息',
    hasArgs: false,
  },
  {
    key: 'mdp',
    callback: () => getYuntuStockMap(),
    msg: 'mdp - 获取大盘热力图',
    hasArgs: false,
  },
  {
    key: 'mcn',
    callback: (symbol) => getFutuStockMap('cn', symbol),
    msg: 'mcn [hy|gu] - 获取富途A股热力图 (hy:行业图 gu:个股图)',
    hasArgs: true,
  },
  {
    key: 'mhk',
    callback: (symbol) => getFutuStockMap('hk', symbol),
    msg: 'mhk [hy|gu] - 获取富途港股热力图 (hy:行业图 gu:个股图)',
    hasArgs: true,
  },
  {
    key: 'mus',
    callback: (symbol) => getFutuStockMap('us', symbol),
    msg: 'mus [hy|gu] - 获取富途美股热力图 (hy:行业图 gu:个股图)',
    hasArgs: true,
  },

  // AI对话
  {
    key: 'a ',
    callback: getAIData,
    msg: 'a [问题] - AI助手对话 例如: a 鲁迅与周树人的关系',
    hasArgs: true,
  },

  // 期货与数字货币
  {
    key: 'f ',
    callback: getFutureData,
    msg: 'f [期货代码] - 获取期货信息 例如: f XAU',
    hasArgs: true,
  },
  {
    key: 'b ',
    callback: getBinanceData,
    msg: 'b [货币代码] - 获取数字货币信息 例如: b btc',
    hasArgs: true,
  },

  // 热点资讯
  {
    key: 'hot',
    callback: getHotSpot,
    msg: 'hot - 获取今日热点概念',
    hasArgs: false,
  },
  {
    key: 'wb',
    callback: getWeiboData,
    msg: 'wb - 获取微博热搜',
    hasArgs: false,
  },

  // 其他工具
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
