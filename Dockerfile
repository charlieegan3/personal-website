FROM alpine:3.7 as build

ENV HUGO_VERSION=0.54.0
ENV HUGO_CHECKSUM=76f90287c12a682c9137b85146c406be410b2b30b0df7367f02ee7c4142bb416
RUN \
  apk add --no-cache openssl ca-certificates && \
  mkdir -p /tmp/hugo && \
  cd /tmp/hugo && \
  wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz -O hugo.tar.gz && \
  echo "${HUGO_CHECKSUM}  hugo.tar.gz" | sha256sum -c && \
  tar xvf hugo.tar.gz && ls && cp hugo /usr/bin/hugo && \
  rm -rf /tmp/hugo

WORKDIR /app

COPY hugo-site .

RUN hugo --environment=production --minify

FROM nginx:1.13-alpine

COPY --from=build /app/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
