FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .
RUN npm run build

# Keep Vite available in the runtime image for the existing deployment contract.
FROM node:21-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["npm", "run", "preview"]