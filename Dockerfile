FROM oven/bun:1.2.21-alpine
WORKDIR /auth

COPY package.json ./
RUN bun install
COPY src .
COPY .env .


EXPOSE 3000

VOLUME [ "/conf" ]

CMD ["bun", "/auth/index.ts"]
