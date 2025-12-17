#!/bin/bash

# Navigate to main project
cd food-waste-management

# Build the project
mvn clean package

# Run the Spring Boot jar
java -jar target/food-waste-management-0.0.1-SNAPSHOT.jar
