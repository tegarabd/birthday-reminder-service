FROM node:23-slim

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

EXPOSE $APP_PORT
CMD ["node", "dist/main"]