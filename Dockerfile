FROM oven/bun:latest

COPY package.json ./
COPY bun.lock ./
COPY src ./

RUN bun install

EXPOSE 3333

CMD ["bun", "./src/index.ts"]
