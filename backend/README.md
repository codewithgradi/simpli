# Simpli Web API

## Overview

Simpli Web API is a scalable and maintainable backend solution built using **.NET Core Web API** and **C#** following modern software engineering principles.

The project is designed using **Clean Architecture** and the **Repository Pattern** to ensure separation of concerns, testability, maintainability, and scalability.

The API provides a structured foundation for building enterprise-level applications with authentication, business logic abstraction, environment configuration support, and database integration.

---

# Tech Stack

## Backend

* .NET Core Web API
* C#

## Database

* Postgres

## Authentication

* Identity API Endpoints
* JWT Authentication

## Libraries & Tools

* Riok.Mapperly
* Scalar
* DotNetEnv (.env support)
* Entity Framework Core
* Fluent API Configuration

---

# Architecture

The project follows the principles of **Clean Architecture**, separating the application into multiple independent layers.

This structure improves:

* Maintainability
* Scalability
* Testability
* Code readability
* Separation of concerns

---

# Project Structure

```bash
Simpli.WebAPI/
│
├── Api/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Extensions/
│   └── Program.cs
│
├── Application/
│   ├── DTOs/
│   ├── Interfaces/
│   ├── BusinessLogic/
│   ├── Mappers/
│   └── Services/
│
├── Domain/
│   ├── Entities/
│   └── Enums/
│
├── Infrastructure/
│   ├── Configurations/
│   ├── Data/
│   ├── Repositories/
│   ├── Utilities/
│   ├── Extensions/
│   └── Env/
│
└── Database/
    └── MySQL
```

---

# Layer Breakdown

## 1. API Layer

The API layer is responsible for handling incoming HTTP requests and returning responses.

### Features

* Built using Controller-Based APIs
* Handles routing and endpoints
* Request validation
* Middleware integration
* Authentication handling
* Swagger / Scalar API documentation

### Responsibilities

* Receive client requests
* Pass requests to the Application layer
* Return standardized API responses

---

## 2. Domain Layer

The Domain layer contains the core business entities and enums.

### Features

* Business entities
* Domain models
* Enums
* Core business rules

### Responsibilities

* Represents the heart of the application
* Contains pure business concepts
* Independent of frameworks and databases

---

## 3. Application Layer

The Application layer contains the business logic of the system.

### Features

* DTOs
* Interfaces
* Business logic
* Services
* Mapperly mappers

### Responsibilities

* Coordinate application workflows
* Handle use cases
* Data transformation
* Validation and business operations

### Mapperly Usage

The project uses **Riok.Mapperly** for high-performance object mapping.

Benefits:

* Compile-time generated mappings
* Faster performance
* Reduced boilerplate code
* Cleaner DTO conversions

---

## 4. Infrastructure Layer

The Infrastructure layer manages external dependencies and implementations.

### Features

* Repository pattern implementation
* Database configurations
* Entity Framework Fluent API
* Utilities
* Extension methods
* Environment variable loading
* Database context

### Responsibilities

* Data access
* External service integrations
* Environment configurations
* Repository implementations

---

# Database Design

The project uses **MySQL** as the primary relational database.

## ORM

* Entity Framework Core

## Database Configuration

* Fluent API configuration
* Entity relationships
* Table mappings
* Constraints and indexes

---

# Authentication & Authorization

Authentication is implemented using:

* ASP.NET Core Identity API Endpoints
* JWT Tokens

## Features

* User registration
* User login
* Secure authentication
* Role-based authorization
* Protected endpoints

---

# Environment Variable Management

Sensitive configurations are loaded using `.env` files.

## Examples

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=simpli_db
DB_USER=root
DB_PASSWORD=password
JWT_SECRET=your_secret_key
```

## Benefits

* Secure configuration handling
* Easier deployment
* Cleaner configuration management

---

# Repository Pattern

The project implements the Repository Pattern to abstract data access logic.

## Benefits

* Cleaner architecture
* Better testing support
* Reduced code duplication
* Easier maintenance
* Decoupled business logic from data access

---

# API Documentation

The API includes interactive documentation using:

* Scalar
* Swagger/OpenAPI

## Features

* Endpoint testing
* Request/response schemas
* Authentication support
* Interactive API exploration

---

# Key Features

* Clean Architecture
* Repository Pattern
* Controller-Based API
* MySQL Integration
* Fluent API Configurations
* Identity Authentication
* JWT Security
* DTO Mapping with Mapperly
* Environment Variable Support
* Scalable Project Structure
* Separation of Concerns
----

# Getting Started

## Clone the Repository

```bash
git clone https://github.com/yourusername/simpli-webapi.git
```

## Navigate to the Project

```bash
cd simpli-webapi
```

## Configure Environment Variables

Create a `.env` file in the root directory.

## Run Database Migrations

```bash
dotnet ef database update --project simpli.api --startup-project simpli.infrastructure
```

## Run the API

```bash
dotnet run --project simpli.api --startup-project simpli.infrastructure
```

---

# Future Improvements

* Unit Testing
* Integration Testing
* Caching
* API Versioning
* Docker Support
* CI/CD Pipeline
* Redis Integration
* Logging & Monitoring

---

# Conclusion

Simpli Web API provides a robust backend architecture for scalable applications using modern .NET development practices.

By combining Clean Architecture, Repository Pattern, Mapperly, Identity Authentication, and MySQL integration, the project creates a maintainable and production-ready foundation for enterprise applications.
