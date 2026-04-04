FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma/
COPY dist ./dist/

RUN npx prisma generate

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
