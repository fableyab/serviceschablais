FROM alpine:3.19

ARG PB_VERSION=0.22.21

RUN apk add --no-cache unzip ca-certificates

WORKDIR /pb

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pocketbase.zip
RUN unzip /tmp/pocketbase.zip -d /pb/ && rm /tmp/pocketbase.zip

COPY pb_hooks /pb/pb_hooks
COPY pb_migrations /pb/pb_migrations

EXPOSE 8080

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data"]
