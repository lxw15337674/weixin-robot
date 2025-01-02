# weixin-robot

## 项目介绍
一个基于[Wechaty](http://github.com/wechaty/wechaty)开发的微信机器人，支持多种实用功能的自动化响应。

## 功能特点
- 基于[Wechaty](http://github.com/wechaty/wechaty)开源项目开发
- 根据指令实现微信回复，包括股票、期货、数字货币、微博热搜、节假日、AI对话等功能
- 支持消息队列，通过限制并发，避免被微信风控
- 支持群聊和私聊消息处理
- 支持自定义回复规则
- 支持Docker部署

## 命令列表

### 股市相关
- `scn` - 获取上证指数信息，包含大盘涨跌幅、成交量等核心数据
- `sus` - 获取美股指数信息，包含大盘涨跌幅、成交量等核心数据
- `shk` - 获取港股指数信息，包含大盘涨跌幅、成交量等核心数据
- `s [股票代码]` - 获取股票信息，支持一次查询多只股票，如：`s 600519 000858`
- `sd [股票代码]` - 获取股票详细信息，如：`sd gzmt`
- `dp` - 获取大盘市场信息，包括涨跌家数、板块概览等
- `mdp` - 获取云图大盘热力图，直观展示市场热点分布
- `mcn [hy|gu]` - 获取富途A股热力图 (hy:行业图 gu:个股图)
- `mhk [hy|gu]` - 获取富途港股热力图 (hy:行业图 gu:个股图)
- `mus [hy|gu]` - 获取富途美股热力图 (hy:行业图 gu:个股图)

### AI对话
- `a [问题]` - AI助手对话，如：`a 鲁迅与周树人的关系`

### 期货与数字货币
- `f [期货代码]` - 获取期货信息，如：`f XAU`
- `b [货币代码]` - 获取数字货币信息，如：`b btc`

### 热点资讯
- `hot` - 获取今日热点概念板块及相关个股
- `wb` - 获取微博热搜

### 其他工具
- `hy` - 获取节假日信息
- `hp` - 获取命令帮助
- `re [文本] [次数]` - 复读机器人，如：`re 你好 3`

## 环境要求
```bash
# 基础环境配置
1. node version 18+
2. yarn version 1.x
3. 微信账号（建议使用小号）
```

## 快速开始

### 1. 安装依赖工具
```bash
npm install -g yarn
```

### 2. 克隆项目
```bash
git clone https://github.com/your-username/weixin-robot.git
cd weixin-robot
```

### 3. 配置环境变量
在项目根目录创建 `.env` 文件，添加以下配置：
```bash
# AI对话功能API密钥
API_KEY=your_api_key
# 其他配置项...
```

### 4. 启动项目
```bash
# 安装项目依赖
yarn

# 开发环境启动
yarn dev

# 生产环境启动
yarn start
```

## 使用说明
1. 首次启动会显示二维码，使用微信扫码登录
2. 登录成功后，机器人就可以正常工作了
3. 发送 `hp` 命令可查看所有支持的指令

## 注意事项
1. 请勿频繁登录登出，可能导致账号被风控
2. 建议使用小号运行机器人
3. 遵守微信使用规范，不要发送违规内容
4. 如遇到问题，可查看日志文件排查

## Docker部署
```bash
# 构建镜像
docker build -t weixin-robot .

# 运行容器
docker run -d \
  --name weixin-robot \
  -e API_KEY=your_api_key \
  weixin-robot
```
