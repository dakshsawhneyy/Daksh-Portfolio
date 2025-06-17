FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci 
#RUN npm install # -ci = clean install -- better than npm install

COPY . .

# Stage 2
FROM node:21-alpine

WORKDIR /app

# Only copy whats important
COPY --from=builder /app ./

EXPOSE 4000

CMD ["npm", "start"]