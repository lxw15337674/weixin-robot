# 使用node20带chrome的环境启动服务
FROM ahmed1n/nodewithchrome AS app

# 首先，更新 apt 包列表并安装 curl 用于下载 Node.js
RUN apt-get update && apt-get install -y curl

# 接着，使用 curl 下载 Node.js 安装脚本并执行安装
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs


WORKDIR /app
COPY package*.json ./
# 使用淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com/

# 使用 pnpm 安装依赖
RUN npm install -g pnpm@7
RUN pnpm install
COPY . .
CMD ["pnpm", "run", "start"]