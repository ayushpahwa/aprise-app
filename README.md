# Aprise Server Repository

## Overview
Aprise is a comprehensive personal finance and expense tracking application, designed to simplify and enhance the way individuals and groups manage their financial activities. This repository contains the server-side code for Aprise, implementing robust features and functionalities centered around user experience and efficiency.

## Features
- User Authentication and Profile Management
- Group-based Expense Tracking
- Multi-currency Support
- Transaction Management
- Insightful Analytics and Reporting

## Architecture
The project adopts a package-by-feature approach, organizing the codebase into distinct modules based on functionality, thereby enhancing maintainability and scalability.

## Getting Started

### Prerequisites
- JDK 11 or later
- Maven 3.6.3 or later
- PostgreSQL 12 or later

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/aprise-server.git
   ```
2. Navigate to the project directory:
   ```
   cd aprise-server
   ```
3. Build the project using Maven:
   ```
   mvn clean install
   ```

### Configuration
Set up your database configurations and other environment-specific settings in `application.properties` or through environment variables.

### Running the Application
Run the application using:
```
mvn spring-boot:run
```
The server will start, typically listening on port 8080.

## API Documentation
The RESTful API endpoints are structured as follows:
- `/user` for user-related operations
- `/groups` for managing groups
- `/transactions` for transaction operations
- Detailed API documentation can be found at [API Docs Link].

## Contributing
Contributions to the Aprise server are welcome. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

## Testing
Run the automated tests with:
```
mvn test
```

## Deployment
For deployment strategies and instructions, refer to [DEPLOYMENT.md](DEPLOYMENT.md).

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
- Developer - ayushpahwa96@gmail.com
- Project Link: https://github.com/ayushpahwa/aprise-server

---
