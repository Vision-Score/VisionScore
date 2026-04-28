FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY s3-xlsx-importer-1.0.0.jar app.jar
COPY .env .env
CMD ["java", "-Xms128m", "-Xmx512m", "-jar", "app.jar"]
