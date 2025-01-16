# 使用官方 Node.js 20 镜像作为基础镜像
FROM node:20-slim AS app


WORKDIR /app

# 复制 package.json
COPY package*.json ./

# 安装依赖
RUN yarn

# 复制其余文件
COPY . .

EXPOSE 6060

CMD ["npm", "run", "start"]
