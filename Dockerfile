FROM node:19-alpine as builder
WORKDIR /builder
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src
COPY .env ./
RUN npm ci && npm run build

FROM node:19-alpine
WORKDIR /app
COPY package*.json ./
COPY --from=builder ./builder/build ./build
ENV NODE_ENV=production
RUN npm ci --omit=dev
CMD [ "npm", "run", "start" ]