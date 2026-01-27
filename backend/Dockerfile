FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY ./target/bin/backend.jar .
COPY ./Config.toml .
EXPOSE 9090
CMD ["java", "-jar", "backend.jar"]
