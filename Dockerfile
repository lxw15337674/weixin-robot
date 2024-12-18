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
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 验证 Node.js 版本
RUN node -v

# 设置 Node.js 为环境变量
ENV NODE_PATH /usr/local/bin
ENV PATH $NODE_PATH:$PATH

# # 设置 Puppeteer 的环境变量，避免下载 Chromium
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# # 安装 Chromium
# RUN apt-get update && apt-get install -y chromium \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./

# 使用淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com/

# 使用 pnpm 安装依赖
RUN npm install -g pnpm
RUN pnpm install

COPY . .

CMD ["pnpm", "run", "start"]