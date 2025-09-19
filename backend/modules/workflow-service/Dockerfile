FROM eclipse-temurin:21-jre-alpine

# Commands that we need to run as root
RUN addgroup --system spring && adduser --system spring --ingroup spring && \
    mkdir /opt/serendipity && chown spring:spring /opt/serendipity

USER spring:spring

COPY ./target/workflow-service-0.0.1-SNAPSHOT.jar /opt/serendipity/workflow-service.jar

ENTRYPOINT ["java", "-jar", "/opt/serendipity/workflow-service.jar"]
