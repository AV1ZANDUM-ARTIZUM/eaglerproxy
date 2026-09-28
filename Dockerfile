FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev && npm install --no-save typescript@5.9.3

COPY . .

RUN npx tsc

ENV EAGLER_BIND_HOST=0.0.0.0
ENV EAGLER_BIND_PORT=8080
ENV EAGLER_UPSTREAM_HOST=127.0.0.1
ENV EAGLER_UPSTREAM_PORT=25568

EXPOSE 8080

CMD ["node", "build/index.js"]
