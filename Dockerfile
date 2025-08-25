# --- deps ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules node_modules
COPY . .
# genera prisma client si hay carpeta prisma (ignora si no existe)
RUN [ -d prisma ] && npx prisma generate || true
RUN npm run build

# --- run ---
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# copio runtime
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# aplica migraciones si existen y luego ejecuta el main que esté disponible
CMD ["sh","-lc","npx prisma migrate deploy || true; node $( [ -f dist/main.js ] && echo dist/main.js || echo dist/src/main.js )"]
