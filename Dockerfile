FROM ahmed1n/nodewithchrome AS app

# 更新 apt-get 并安装必要的依赖
RUN apt-get update && apt-get install -y fontconfig \
    && apt-get install -y --no-install-recommends \
    fonts-wqy-zenhei \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 安装 Node.js 20（满足 pnpm 的 Node.js 版本要求）
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# 设置 Node.js 为环境变量
ENV NODE_PATH /usr/local/bin
ENV PATH $NODE_PATH:$PATH

WORKDIR /app
COPY package*.json ./

# 使用淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com/

# 使用 pnpm 安装依赖
RUN npm install -g pnpm
RUN pnpm install

COPY . .

CMD ["pnpm", "run", "start"]