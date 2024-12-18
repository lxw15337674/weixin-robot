FROM ahmed1n/nodewithchrome AS app

# 更新 apt-get 并安装必要的依赖
RUN apt-get update && apt-get install -y fontconfig \
    && apt-get install -y --no-install-recommends \
    fonts-wqy-zenhei \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 删除之前的 Node.js 版本
RUN apt-get remove -y nodejs

# 安装 Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

WORKDIR /app
COPY package*.json ./
# 使用淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com/

# 使用 pnpm 安装依赖
RUN npm install -g pnpm
RUN pnpm install
COPY . .
CMD ["pnpm", "run", "start"]