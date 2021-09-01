FROM node:lts
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY packages/react-app/package.json ./
COPY packages/react-app/package-lock.json ./
RUN npm install
COPY packages/react-app/ ./
CMD ["npm", "start"]
EXPOSE 3000