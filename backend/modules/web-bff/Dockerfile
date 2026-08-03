# Stage 1: Extract JAR layers
FROM eclipse-temurin:25-jre-alpine AS builder
WORKDIR /builder
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} application.jar
RUN java -Djarmode=tools -jar application.jar extract --layers --destination extracted/

# Stage 2: Runtime image
FROM eclipse-temurin:25-jre-alpine

RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /opt/serendipity

USER spring:spring

# Copy layers separately to maximize Docker cache utilization
COPY --from=builder --chown=spring:spring /builder/extracted/dependencies/ ./
COPY --from=builder --chown=spring:spring /builder/extracted/spring-boot-loader/ ./
COPY --from=builder --chown=spring:spring /builder/extracted/snapshot-dependencies/ ./
COPY --from=builder --chown=spring:spring /builder/extracted/application/ ./

# ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
# ENTRYPOINT ["java", "-cp", "BOOT-INF/classes:BOOT-INF/lib/*", "org.serendipity.webbff.WebBffApplication"]
# ENTRYPOINT ["java", "-cp", ".:lib/*:application.jar", "org.springframework.boot.loader.launch.JarLauncher"]
ENTRYPOINT ["java", "-jar", "application.jar"]