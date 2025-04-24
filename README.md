# 🎂 Birthday Reminder Service

This repository contains two NestJS applications:

1. **User Management API**: Handles user CRUD operations (with MongoDB)
2. **Birthday Worker**: Sends birthday greetings to users at **9 AM local time** using Agenda and MongoDB.

---

## 🚀 Getting Started

### 1. Setup Environment Files

#### `user-api/.env`
```env
MONGO_URI=mongodb://mongodb:27017/birthday-db
PORT=3000
```

#### `birthday-worker/.env`
```env
MONGO_URI=mongodb://mongodb:27017/birthday-db
PORT=3001
REMINDER_HOUR=9
REMINDER_MINUTE=0
```

### 2. Run the Application with Docker

```bash
docker-compose up --build
```

> This starts MongoDB, the User API at `localhost:3000/api`, and the birthday worker in background.

---

## 📡 API Reference

### Create a New User
```http
POST /users
```
#### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "birthday": "1999-09-09",
  "timezone": "Europe/London"
}
```

### Retrieve All Users
```http
GET /users
```

### Retrieve a Single User
```http
GET /users/:id
```

### Update a User
```http
PATCH /users/:id
```
#### Request Body
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "birthday": "2000-10-10",
  "timezone": "Asia/Jakarta"
}
```

### Delete a User
```http
DELETE /users/:id
```

---

## 🧠 Design Decisions

- **Decoupled Architecture**: The user API and birthday worker are independently deployable and scalable.
- **Agenda for Scheduling**: Reliable job scheduling using MongoDB-backed Agenda.
- **Timezone Support**: Jobs run at **9 AM local time** using `moment-timezone`.
- **Job Persistence**: Jobs remain scheduled even after restarts.

---

## ⚠️ Limitations and Assumptions

- Valid [IANA timezones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) are required.
- Messages are plain text and log-based.
- Year in birthday date is used for scheduling the next closest birthday.
- Both services share the same MongoDB instance defined in `docker-compose.yml`.

---

## 📦 Technologies Used
- NestJS
- MongoDB + TypeORM
- Agenda
- moment-timezone
- Nodemailer
- Docker + Docker Compose

