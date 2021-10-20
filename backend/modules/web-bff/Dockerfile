FROM adoptopenjdk/openjdk11:jre-11.0.9.1_1-alpine@sha256:b6ab039066382d39cfc843914ef1fc624aa60e2a16ede433509ccadd6d995b1f

# Commands that we need to run as root
RUN addgroup --system spring && adduser --system spring --ingroup spring && \
    mkdir /opt/serendipity && chown spring:spring /opt/serendipity

USER spring:spring

COPY ./target/web-bff-0.0.1-SNAPSHOT.jar /opt/serendipity/web-bff.jar

ENTRYPOINT ["java", "-jar", "/opt/serendipity/web-bff.jar"]

# https://spring.io/guides/topicals/spring-boot-docker/
# https://hub.docker.com/r/adoptopenjdk/openjdk11/
# https://snyk.io/blog/best-practices-to-build-java-containers-with-docker/
