# Lightweight distro
FROM alpine:3

## Installing java and dependencies
RUN    apk update \
    && apk upgrade \
    && apk add ca-certificates \
    && update-ca-certificates \
    && apk add --update openjdk8-jre tzdata curl unzip bash coreutils \
    && rm -rf /var/cache/apk/* \
    && mkdir -p /opt/jmeter/results \
    && mkdir /opt/jmeter/logs/ \
    && mkdir /temp \
    && --add-host=host.docker.internal:host-gateway

ENTRYPOINT ["/opt/entrypoint.sh"]

COPY ./entrypoint.sh /opt/entrypoint.sh
ENV HOME /opt/jmeter/
