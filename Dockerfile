# 使用node20带chrome的环境启动服务
FROM ahmed1n/nodewithchrome AS app


RUN apt-get update && apt-get install -y fontconfig \
    && apt-get install -y --no-install-recommends \
    fonts-wqy-zenhei \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
# 使用淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com/

# 使用 pnpm 安装依赖
RUN npm install -g pnpm
RUN pnpm install
COPY . .
CMD ["pnpm", "run", "start"]