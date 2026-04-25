FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install ajv@8 --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

