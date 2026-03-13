# MERN Authentication Web App

A full-stack authentication application built with **MongoDB**, **Express**, **React**, and **Node.js** (MERN stack) with TypeScript.

## Features

- User Registration & Login
- JWT Authentication (Access + Refresh tokens)
- HttpOnly Cookie-based refresh tokens
- Protected routes (frontend & backend)
- Input validation (Joi on backend, react-hook-form on frontend)
- Error Boundary for graceful error handling
- Lazy-loaded routes with React.lazy & Suspense
- Security: Helmet, CORS, Rate Limiting, HPP, input sanitization
- ESLint + Prettier + Husky + lint-staged for code quality

## Project Structure

```
├── .husky/                    # Git hooks
│   └── pre-commit             # Runs lint-staged on commit
├── server/                    # Express + TypeScript API
│   ├── src/
│   │   ├── config/            # Environment config
│   │   ├── db/                # MongoDB connection
│   │   ├── features/auth/     # Auth module (models, controllers, services, routes, validations)
│   │   ├── middlewares/       # Auth, validation, error middlewares
│   │   ├── utils/             # Constants, logger
│   │   └── App.ts             # Entry point
│   ├── eslint.config.mjs      # ESLint config
│   ├── .prettierrc            # Prettier config
│   └── package.json
├── client/                    # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/        # ProtectedRoute, PublicRoute, ErrorBoundary
│   │   ├── constants/         # App constants
│   │   ├── hooks/             # useAuth context hook
│   │   ├── interfaces/        # TypeScript interfaces
│   │   ├── pages/             # Login, Register, Dashboard
│   │   ├── routes/            # App routes
│   │   ├── services/          # API client & auth service
│   │   ├── styles/            # Global styles
│   │   ├── App.tsx            # Root component
│   │   └── main.tsx           # Entry point
│   ├── eslint.config.js       # ESLint config
│   ├── .prettierrc            # Prettier config
│   └── package.json
└── package.json               # Root package.json
```

## Prerequisites

- **Node.js** >= 18.x
- **MongoDB** (running locally or remote URI)
- **npm** >= 9.x

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd mern-auth

# Install all dependencies
npm run install:all
```

### 2. Configure Environment

Copy the example env file for the server:

```bash
cp server/env.example.json server/env.json
```

Update `server/env.json` with your MongoDB URI and JWT secrets.

### 3. Initialize Husky

```bash
npm install
npx husky init
```

The `.husky/pre-commit` hook is already configured.

### 4. Run Development

Open **two terminals**:

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

- Server runs on: `http://localhost:5000`
- Client runs on: `http://localhost:5173`

## API Endpoints

| Method | Endpoint                  | Auth      | Description      |
| ------ | ------------------------- | --------- | ---------------- |
| POST   | `/api/auth/register`      | Public    | Register a user  |
| POST   | `/api/auth/login`         | Public    | Login            |
| POST   | `/api/auth/refresh-token` | Public    | Refresh tokens   |
| GET    | `/api/auth/profile`       | Protected | Get user profile |
| POST   | `/api/auth/logout`        | Protected | Logout           |
| GET    | `/api/health`             | Public    | Health check     |

## Scripts

| Script                | Description                  |
| --------------------- | ---------------------------- |
| `npm run install:all` | Install server & client deps |
| `npm run dev:server`  | Start backend in dev mode    |
| `npm run dev:client`  | Start frontend in dev mode   |
| `npm run lint`        | Lint both projects           |
| `npm run format`      | Format both projects         |

## Tech Stack

**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Joi, Winston, Helmet

**Frontend:** React 18, TypeScript, Vite, React Router, React Hook Form, Axios, SCSS

**Tooling:** ESLint 9 (flat config), Prettier, Husky, lint-staged
