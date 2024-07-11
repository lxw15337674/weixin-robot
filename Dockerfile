ARG APT_SOURCE="debian"

FROM ${APT_SOURCE}:bullseye AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    apt-utils \
    autoconf \
    automake \
    bash \
    build-essential \
    ca-certificates \
    chromium \
    coreutils \
    curl \
    ffmpeg \
    figlet \
    git \
    gnupg2 \
    jq \
    libgconf-2-4 \
    libtool \
    libxtst6 \
    moreutils \
    python3-dev \
    shellcheck \
    sudo \
    tzdata \
    vim \
    wget \
    curl \
    gnupg \
  && apt-get purge --auto-remove \
  && rm -rf /tmp/* /var/lib/apt/lists/*

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs

# Install pnpm
ARG PNPM_VERSION=9.4.0
RUN npm install -g pnpm@$PNPM_VERSION

FROM base AS builder
ENV CHROME_BIN="/usr/bin/chromium" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN mkdir -p /app
WORKDIR /app

COPY package.json ./
RUN  pnpm i

COPY *.js ./
COPY src/ ./src/


# Development Stage
FROM builder AS development
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . . 
CMD ["pnpm", "run", "dev"]