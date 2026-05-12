FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm codegen

FROM base AS production

WORKDIR /app

RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/ponder.config.ts ./ponder.config.ts
COPY --from=build /app/ponder.schema.ts ./ponder.schema.ts
COPY --from=build /app/ponder-env.d.ts ./ponder-env.d.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/abis ./abis
COPY --from=build /app/src ./src
COPY --from=build /app/migrations ./migrations

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start"]
