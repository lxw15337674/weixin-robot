# 使用官方 Node.js 20 镜像作为基础镜像
FROM node:20-slim AS app

# 更新 apt-get 并安装必要的依赖
RUN apt-get update && apt-get install -y \
    fontconfig \
    fonts-wqy-zenhei \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libgbm1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    dbus

WORKDIR /app

# 复制 package.json
COPY package*.json ./

# 使用 bun 安装依赖
RUN yarn

# 复制其余文件
COPY . .

EXPOSE 6060

# 使用 bun 运行应用
CMD ["npm", "run", "start"]
