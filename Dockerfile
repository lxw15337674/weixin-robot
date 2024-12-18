# 使用node20带chrome的环境启动服务
FROM ahmed1n/nodewithchrome AS app

WORKDIR /app
COPY package*.json ./
# 使用淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com/

# 使用 pnpm 安装依赖
RUN npm install -g pnpm@7
RUN pnpm install
COPY .dockerignore .dockerignore
COPY . .
CMD ["pnpm", "run", "start"]