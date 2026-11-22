# Fase 1: build dell'applicazione React
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Dati veri del backend: senza questa variabile la build usa i dati di esempio (config/env.ts).
# I file .env* non entrano nell'immagine (.dockerignore), quindi l'interruttore sta qui.
ARG VITE_USE_MOCKS=false
ENV VITE_USE_MOCKS=$VITE_USE_MOCKS
RUN npm run build

# Fase 2: nginx serve i file statici e inoltra /api al backend
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
