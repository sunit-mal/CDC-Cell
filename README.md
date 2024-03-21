# CDC Cell

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation Process](#installation-process)
- [Usage](#usage)
- [Contributing](#contributing)
- [Project Creators](#project-creators)
- [License](#license)

## Introduction

CDC Cell is a secure web-based application designed for managing skill development and job placement services. It provides users with a platform to share their skills, contact information, and resumes, facilitating connections between students/alumni and potential employers.

## Features

- **User Authentication**: Secure access to the application with user authentication.
- **Search Functionality**: Quickly find user details using the search feature.
- **Multi-device Sync**: Synchronize data across multiple devices for seamless access.
- **User-Friendly Interface**: Intuitive and easy-to-use interface for a seamless user experience.
- **Skill Sharing**: Users can share their skills with others on the platform.
- **Contact Information**: Store and manage contact information for networking purposes.
- **Resume Upload**: Upload resumes to showcase qualifications and experiences.

## Tech Stack

- **Spring Boot**: Java-based framework for building the backend.
- **React**: JavaScript library for building the frontend user interface.
- **Database**: MySQL 8 (or specify the version you're using).

## Installation Process

To set up CDC Cell on your local machine, follow these steps:

1. **Clone the Repository**: Clone the CDC Cell repository to your local machine.
2. **Set Up Backend**:
    - Navigate to the backend directory.
    - Install dependencies: `mvn install`
    - Run the backend server: `mvn spring-boot:run`
3. **Set Up Frontend**:
    - Navigate to the frontend directory.
    - Install dependencies: `npm install`
    - Run the frontend server: `npm start`
4. **Database Configuration**:
    - Create a database on your local MySQL server: `CREATE DATABASE cdc_cell;`
    - Configure your username and password in the [application.properties](CDC_Cell/src/main/resources/application.properties) file.
5. **Create Admin User**:
    - Create an admin user in the database using the `/register` endpoint.
    - Change the user's role to `ADMINISTRATOR` using your MySQL client.
6. **Access CDC Cell**:
    - Open your web browser and navigate to the CDC Cell application.
    - Log in with your credentials and start using the application.

## Usage

Once CDC Cell is set up, you can use it to securely store and manage your personal information, including skills, contact details, and resumes. Here are some usage instructions:

- Log in to the application using your credentials.
- Create users and store their skills, contact information, and resumes.
- Utilize the search functionality to quickly find specific users based on their details.

## Contributing

Contributions to CDC Cell are welcome! If you'd like to contribute to this project, please follow these guidelines:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Follow coding conventions and ensure tests are passing.
- Create a pull request with a clear description of your changes.

## Project Creators

- [Sunit Mal](https://www.linkedin.com/in/sunit-mal/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
