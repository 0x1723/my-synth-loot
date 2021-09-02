# build environment
FROM node:lts as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY packages/react-app/package.json ./
COPY packages/react-app/package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g --silent
COPY packages/react-app/ ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]