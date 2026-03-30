# Property Management Project

## Overview

A property management application with a Node.js/Express backend and a React frontend built with Vite.

---

## Application Flow

```
┌─────────────┐
│   Sign Up   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Login    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Dashboard     │
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│ View Properties     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Add to Favourites   │
└─────────────────────┘
```

**User Journey:**

1. **Sign Up** - Create a new account with email and password
2. **Login** - Authenticate with credentials to access the dashboard
3. **Dashboard** - View all available properties
4. **View Properties** - Browse property details
5. **Add to Favourites** - Save preferred properties for later reference

---

## Prerequisites

- Node.js
- npm

## Backend Server

1. Change into the backend directory and install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in the `backend` folder with the required variables (example below):

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=property_db
DB_PORT=3306
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
PORT=500

3. Run in development:

```bash
npm run dev
```

4. Run for production:

```bash
npm start
```

---

## Frontend (Client)

1. Change into the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

2. Run the frontend in development:

```bash
npm run dev
```

## Project Structure

```
├── backend/
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication & custom middleware
│   ├── routes/            # API route definitions
│   ├── db.js              # Database configuration
│   ├── server.js          # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities (axios)
│   │   ├── App.jsx        # Root component
│   │   └── main.jsx       # Entry point
│   ├── vite.config.js
│   └── package.json
└── README.md
```
