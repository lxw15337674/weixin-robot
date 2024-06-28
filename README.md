# weixin-robot

- 根据指令实现AI对话，微博热搜，股票查询等功能。
- 基于[Wechaty](http://github.com/wechaty/wechaty)开源项目开发。

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


