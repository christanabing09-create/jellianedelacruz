# Backend Turso API

A production-ready REST API built with **Node.js**, **Express.js**, and **Turso Cloud Database** (SQLite/libSQL). Deployable on **Vercel** in one command.

---

## Project Structure

```
backend/
├── api/
│   └── index.js            # Express app entry point (Vercel handler)
├── config/
│   └── db.js               # Turso DB client + auto table creation
├── controllers/
│   └── userController.js   # CRUD logic for users
├── routes/
│   └── userRoutes.js       # Express router
├── middleware/
│   └── errorHandler.js     # 404 + global error handler
├── database/
│   └── schema.sql          # Reference SQL schema
├── .env.example            # Environment variable template
├── .gitignore
├── package.json
├── vercel.json             # Vercel deployment config
├── postman_collection.json # Import into Postman
└── README.md
```

---

## Prerequisites

- Node.js v18 or higher
- A free [Turso](https://turso.tech) account
- (Optional) [Vercel CLI](https://vercel.com/docs/cli) for deployment

---

## 1. Turso Setup

### Install the Turso CLI

```bash
# macOS / Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (WSL recommended, or use the web dashboard)
```

### Authenticate

```bash
turso auth login
```

### Create a database

```bash
turso db create my-backend-db
```

### Get your credentials

```bash
# Database URL
turso db show my-backend-db --url

# Auth token
turso db tokens create my-backend-db
```

Copy both values — you will need them for the `.env` file.

> **Tip:** You can also find these in the [Turso web dashboard](https://app.turso.tech) under your database → **Connect**.

---

## 2. Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
TURSO_DATABASE_URL=libsql://your-database-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token-here
PORT=3000
```

> The `users` table is created automatically when the app starts — no manual migration needed.

---

## 3. Installation

```bash
npm install
```

---

## 4. Local Development

```bash
npm run dev
```

The server starts at `http://localhost:3000`.

You should see:

```
✅ Database initialized — users table ready.
🚀 Server running on http://localhost:3000
📋 API available at http://localhost:3000/api/users
```

---

## 5. Deploying to Vercel

### Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Add environment variables to Vercel

```bash
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
```

Paste your values when prompted. Select **Production**, **Preview**, and **Development** for both.

### Deploy

```bash
vercel --prod
```

Your API will be live at `https://your-project.vercel.app`.

---

## 6. API Endpoints

Base URL (local): `http://localhost:3000`  
Base URL (production): `https://your-project.vercel.app`

| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| GET    | `/api/users`      | Get all users      |
| GET    | `/api/users/:id`  | Get user by ID     |
| POST   | `/api/users`      | Create a new user  |
| PUT    | `/api/users/:id`  | Update a user      |
| DELETE | `/api/users/:id`  | Delete a user      |

---

## 7. Request Body

Used for **POST** and **PUT** requests:

```json
{
  "user_login": "admin",
  "user_pass": "password123",
  "fname": "John",
  "lname": "Doe",
  "gender": "Male",
  "user_level": 1,
  "branch_cd": "A001",
  "email": "john@example.com",
  "user_activation_key": "abc123",
  "isActive": 1
}
```

**Required fields:** `user_login`, `user_pass`, `fname`, `lname`, `gender`  
All other fields are optional and default to their schema defaults.

---

## 8. Response Format

### Success

```json
{
  "success": true,
  "message": "User created successfully.",
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "message": "Missing required fields: fname, lname."
}
```

---

## 9. Sample Requests & Responses

### GET /api/users

```http
GET http://localhost:3000/api/users
```

**Response 200:**
```json
{
  "success": true,
  "message": "Users retrieved successfully.",
  "data": [
    {
      "user_id": 1,
      "user_login": "admin",
      "user_pass": "$2a$10$N9qo8uLOickgx2ZMRZoMye...",
      "fname": "John",
      "lname": "Doe",
      "gender": "Male",
      "user_level": 1,
      "branch_cd": "A001",
      "email": "john@example.com",
      "registered": "2024-01-01 00:00:00",
      "user_activation_key": "abc123",
      "isActive": 1
    }
  ]
}
```

---

### GET /api/users/1

```http
GET http://localhost:3000/api/users/1
```

**Response 200:**
```json
{
  "success": true,
  "message": "User retrieved successfully.",
  "data": {
    "user_id": 1,
    "user_login": "admin",
    "fname": "John",
    "lname": "Doe",
    ...
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "message": "User with ID 99 not found."
}
```

---

### POST /api/users

```http
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "user_login": "admin",
  "user_pass": "password123",
  "fname": "John",
  "lname": "Doe",
  "gender": "Male",
  "user_level": 1,
  "branch_cd": "A001",
  "email": "john@example.com",
  "user_activation_key": "abc123",
  "isActive": 1
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "user_id": 1,
    "user_login": "admin",
    "user_pass": "$2a$10$hashed...",
    "fname": "John",
    "lname": "Doe",
    "gender": "Male",
    "user_level": 1,
    "branch_cd": "A001",
    "email": "john@example.com",
    "registered": "2024-01-01 00:00:00",
    "user_activation_key": "abc123",
    "isActive": 1
  }
}
```

---

### PUT /api/users/1

```http
PUT http://localhost:3000/api/users/1
Content-Type: application/json

{
  "user_login": "admin_updated",
  "user_pass": "newpassword456",
  "fname": "Jane",
  "lname": "Doe",
  "gender": "Female",
  "user_level": 2,
  "branch_cd": "B002",
  "email": "jane@example.com",
  "user_activation_key": "xyz789",
  "isActive": 1
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "User updated successfully.",
  "data": { ... }
}
```

---

### DELETE /api/users/1

```http
DELETE http://localhost:3000/api/users/1
```

**Response 200:**
```json
{
  "success": true,
  "message": "User with ID 1 deleted successfully.",
  "data": null
}
```

---

## 10. Postman Testing

1. Open Postman
2. Click **Import**
3. Select `postman_collection.json` from this project
4. Set the `base_url` collection variable to your server URL:
   - Local: `http://localhost:3000`
   - Production: `https://your-project.vercel.app`
5. Run requests in order: **POST** first to create a user, then **GET**, **PUT**, **DELETE**

---

## Notes

- Passwords are hashed with **bcryptjs** (10 salt rounds) before being stored
- The PUT endpoint is smart: if you pass back the already-hashed password (from a GET response), it will not double-hash it
- The `users` table is created automatically on startup — no manual DB setup needed
- All endpoints return consistent JSON with `success`, `message`, and `data` fields
