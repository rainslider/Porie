FROM node:20-alpine
WORKDIR /app
COPY . .
RUN mkdir -p /data
ENV PORT=3000 DATA_DIR=/data ADMIN_CODE=gggrite5
VOLUME /data
EXPOSE 3000
HEALTHCHECK --interval=30s CMD wget -qO- http://localhost:3000/ >/dev/null || exit 1
CMD ["node","server.js"]
