# Event Registration System - Backend

This is the backend for an Event Registration System, built as part of the CodeAlpha internship. It provides a robust set of APIs for user authentication, event management, and user registration for events, including role-based access control.

## ✨ Features

* **User Authentication & Authorization:**
    * User Registration and Login with JWT (JSON Web Tokens) for secure session management.
    * Password hashing using `bcryptjs` for security.
    * Role-Based Access Control (`user` and `admin` roles).
* **Event Management (CRUD):**
    * Create, Read (all/single), Update, and Delete events.
    * Admin-only access for creating, updating, and deleting events.
    * Events include details like title, description, date, location, and capacity.
* **Event Registration:**
    * Authenticated users can register for events.
    * Capacity checks to prevent over-registration.
    * Prevents duplicate registrations by the same user for the same event.
    * Users can view their own registered events.
    * Admin can view all registrations.
    * Users can cancel their registrations, and admins can cancel any registration.
* **Database Integration:**
    * MongoDB as the NoSQL database, connected via Mongoose ODM.
    * Defined schemas for Users, Events, and Registrations.
    * Relationships between models (e.g., `organizer` of an event, `user` and `event` in a registration) are handled via Mongoose population.
* **Error Handling:**
    * Centralized error handling middleware.
    * Custom middleware for handling 404 Not Found errors.
* **Environment Variables:** Secure management of sensitive configurations using `dotenv`.

## 🛠️ Technologies Used

* **Node.js:** JavaScript runtime.
* **Express.js:** Web application framework for Node.js.
* **MongoDB:** NoSQL database.
* **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
* **JWT (jsonwebtoken):** For authentication tokens.
* **Bcryptjs:** For password hashing.
* **Express-Async-Handler:** Simple middleware for handling exceptions inside of async express routes.
* **Cors:** Middleware for enabling Cross-Origin Resource Sharing.
* **Dotenv:** For loading environment variables from a `.env` file.

## 🚀 Getting Started

Follow these steps to set up and run the backend locally on your machine.

### Prerequisites

* **Node.js & npm:** Ensure you have Node.js (v14 or higher recommended) and npm installed.
    * [Download Node.js](https://nodejs.org/en/download/)
* **MongoDB Atlas Account:** You'll need a free MongoDB Atlas account to set up your cloud database.
    * [Sign up for MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
    * Set up a new cluster, create a database user with password, and whitelist your IP address.
    * Obtain your MongoDB connection URI (it will look something like `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Aditichoubey-adi/CodeAlpha_event-registration-system-backend.git](https://github.com/Aditichoubey-adi/CodeAlpha_event-registration-system-backend.git)
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd CodeAlpha_event-registration-system-backend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables (`.env` file)

Create a file named `.env` in the root of your project directory (the same level as `server.js`) and add the following environment variables. Replace the placeholder values with your actual credentials.

```env
MONGO_URI=mongodb+srv://eventappuser:Yiy0JbkxncMdgefK@cluster0.4vko7uk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecretjwtkeythatyoushouldchangeinproduction
PORT=5000




## 🔌 API Endpoints

You can test these endpoints using tools like [Postman](https://www.postman.com/downloads/), Insomnia, or VS Code's Thunder Client.

**Base URL:** `http://localhost:5000`

---

### **1. Authentication Endpoints (`/api/auth`)**

| Method | Endpoint | Description | Access | Request Body Example (JSON) | Success Response Example (JSON) |
| :----- | :------- | :---------- | :----- | :-------------------------- | :------------------------------ |
| `POST` | `/register` | Register a new user | Public | `{ "name": "John Doe", "email": "john@example.com", "password": "password123", "role": "user" }` (role optional, defaults to 'user') | `{ "_id": "...", "name": "...", "email": "...", "role": "...", "token": "..." }` |
| `POST` | `/login` | Authenticate and log in a user | Public | `{ "email": "john@example.com", "password": "password123" }` | `{ "_id": "...", "name": "...", "email": "...", "role": "...", "token": "..." }` |

---

### **2. Event Endpoints (`/api/events`)**

**Note:** For routes requiring `Admin` access, you must include an `Authorization` header with a valid Admin JWT: `Authorization: Bearer YOUR_ADMIN_JWT_HERE`

| Method | Endpoint | Description | Access | Request Body Example (JSON) | Success Response Example (JSON) |
| :----- | :------- | :---------- | :----- | :-------------------------- | :------------------------------ |
| `POST` | `/` | Create a new event | Admin | `{ "title": "Tech Summit", "description": "Latest in tech", "date": "2025-07-20T10:00:00Z", "location": "Online", "capacity": 200 }` | `{ "_id": "...", "title": "...", "organizer": "..." }` |
| `GET` | `/` | Get all events | Public | (None) | `[ { "_id": "...", "title": "...", "organizer": { "_id": "...", "name": "..." } } ]` |
| `GET` | `/:id` | Get single event by ID | Public | (None) | `{ "_id": "...", "title": "...", "description": "...", "organizer": { "_id": "...", "name": "..." }, "registeredAttendees": [...] }` |
| `PUT` | `/:id` | Update an event by ID | Admin | `{ "title": "Updated Title", "capacity": 250 }` | `{ "_id": "...", "title": "Updated Title", "capacity": 250, ... }` |
| `DELETE` | `/:id` | Delete an event by ID | Admin | (None) | `{ "message": "Event removed" }` |

---

### **3. Registration Endpoints (`/api/registrations`)**

**Note:** For all these routes, you must include an `Authorization` header with a valid User or Admin JWT: `Authorization: Bearer YOUR_JWT_HERE`

| Method | Endpoint | Description | Access | Request Body Example (JSON) | Success Response Example (JSON) |
| :----- | :------- | :---------- | :----- | :-------------------------- | :------------------------------ |
| `POST` | `/` | Register for an event | Private (User) | `{ "eventId": "YOUR_EVENT_ID_HERE" }` | `{ "message": "Successfully registered for event", "registration": { "_id": "...", "user": "...", "event": "..." } }` |
| `GET` | `/myregistrations` | Get all registrations for the authenticated user | Private (User) | (None) | `[ { "_id": "...", "user": { "_id": "...", "name": "..." }, "event": { "_id": "...", "title": "..." }, ... } ]` |
| `GET` | `/all` | Get all registrations (for all users) | Private (Admin) | (None) | `[ { "_id": "...", "user": { "_id": "...", "name": "..." }, "event": { "_id": "...", "title": "..." }, ... } ]` |
| `DELETE` | `/:id` | Cancel a specific registration by ID | Private (User/Admin) | (None) | `{ "message": "Registration cancelled successfully" }` |

---

## 🤝 Contribution

Feel free to fork the repository, open issues, or submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.