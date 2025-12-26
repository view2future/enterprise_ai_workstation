# --- 阶段 1: 构建前端 ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- 阶段 2: 构建后端 ---
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npx prisma generate
RUN npm run build

# --- 阶段 3: 生产环境镜像 ---
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

# 复制后端编译文件和依赖
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/prisma ./backend/prisma

# 复制前端构建产物到后端指定的静态目录
COPY --from=frontend-builder /app/frontend/dist ./backend/static

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80

CMD ["sh", "-c", "cd backend && npx prisma db push && node dist/main.js"]
