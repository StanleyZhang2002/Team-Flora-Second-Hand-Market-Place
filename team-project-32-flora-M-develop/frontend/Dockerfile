# Dockerfile for frontend
FROM node:10.15.3-alpine
WORKDIR .
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
COPY . ./
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]