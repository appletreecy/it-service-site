# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# 1) Install deps (including dev deps so prisma CLI exists)
COPY package*.json ./
RUN npm ci

# 2) Copy source (including prisma/schema.prisma)
COPY . .

# 3) Generate Prisma Client (creates node_modules/.prisma)
# If your schema is not at prisma/schema.prisma, see note below.
RUN npx prisma generate

# 4) Build TypeScript -> dist/
RUN npm run build

# 5) Remove dev deps for smaller runtime
RUN npm prune --omit=dev


# ---------- runtime stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy the minimal runtime artifacts
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# (Optional but nice) keep prisma schema in image for debugging/migrate commands
COPY --from=build /app/prisma ./prisma

EXPOSE 4000
CMD ["node", "dist/server.js"]
