# weixin-robot

- 基于[Wechaty](http://github.com/wechaty/wechaty)开源项目开发。
- 根据指令实现微信回复，包括股票、期货、数字货币、微博热搜、节假日、AI对话等功能。
  
# 命令列表：
- a [问题] 或 艾特机器人[问题]  - 向国产AI提问 例如: a 鲁迅与周树人的关系是什么？
- ss - 获取上证指数信息
- sd [股票代码] - 获取股票详细信息 例如: sd gzmt
- s [股票代码] - 获取股票信息 例如: s gzmt
- f [期货代码] - 获取期货信息 例如: f XAU
- b [货币代码] - 获取数字货币信息 例如: b btc
- wb - 获取微博热搜
- hy - 获取节假日信息
- hp - 获取命令帮助


## 环境要求
```bash
# configure
1. node version 18+
2. pnpm version 7.x
```

##pnpm 安装
```bash
npm install -g pnpm
```

## 🚀 Development
1. 配置环境变量：API_KEY，用于AI对话功能。
2. 执行以下命令：
```bash
# install dependencies
pnpm i
# start the service
pnpm dev
```
## Deploy
推荐使用fly.io部署，直接docker部署即可。

