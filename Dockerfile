FROM oven/bun:1.2 AS build
WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

FROM oven/bun:1.2 
WORKDIR /app

COPY --from=build /app/build /app
COPY --from=build /app/package.json /app
COPY --from=build /app/bun.lock /app
COPY --from=build /app/drizzle.config.ts /app
COPY --from=build /app/drizzle /app/drizzle

RUN bun install --production drizzle-kit

EXPOSE 3000

CMD [ "bun", "--bun", "/app/index.js" ]