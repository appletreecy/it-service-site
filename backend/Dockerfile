FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# If you use TypeScript, ensure npm run build creates dist/
RUN npm run build || true

EXPOSE 4000
CMD ["npm", "start"]
