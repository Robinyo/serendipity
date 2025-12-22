FROM eclipse-temurin:25-jre-alpine

# Commands that we need to run as root
RUN addgroup --system spring && \
    adduser --system spring --ingroup spring && \
    mkdir /opt/serendipity && \
    chown spring:spring /opt/serendipity

USER spring:spring

COPY ./target/web-bff-0.0.1-SNAPSHOT.jar /opt/serendipity/web-bff.jar

ENTRYPOINT ["java", "-jar", "/opt/serendipity/web-bff.jar"]
