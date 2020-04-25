FROM jboss/keycloak:9.0.3

ENV THEME_VERSION 1.0

USER root

RUN microdnf install -y unzip

COPY ./serendipity-keycloak-theme-$THEME_VERSION.zip /opt/jboss/keycloak/themes/
RUN cd /opt/jboss/keycloak/themes/ && \
    unzip serendipity-keycloak-theme-$THEME_VERSION.zip && \
    rm serendipity-keycloak-theme-$THEME_VERSION.zip
